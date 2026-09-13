import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import * as mediaService from './mediaService.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const getActive = async () => {
  let resume = await Resume.findOne({ isActive: true });
  if (!resume) {
    resume = await Resume.findOne().sort({ createdAt: -1 });
  }
  return resume;
};

export const getAll = async () => {
  return Resume.find().sort({ createdAt: -1 });
};

export const upload = async (file, adminId) => {
  if (!file) throw ApiError.badRequest('No resume file provided');

  // Upload through media service
  const media = await mediaService.upload(file, adminId, 'Resume PDF');

  // Count existing to determine version
  const count = await Resume.countDocuments();
  const nextVersion = count + 1;

  // Deactivate existing
  await Resume.updateMany({}, { isActive: false });

  // Create new active Resume
  const resume = await Resume.create({
    originalName: file.originalname,
    filename: media.filename,
    url: media.url,
    publicId: media.publicId,
    size: file.size,
    mimeType: file.mimetype || 'application/pdf',
    isActive: true,
    version: nextVersion,
    uploadedBy: adminId,
  });

  // Sync with Profile singleton
  try {
    const profile = await Profile.findOne();
    if (profile) {
      profile.resume = {
        url: resume.url,
        publicId: resume.publicId,
        originalName: resume.originalName,
        uploadedAt: new Date(),
      };
      await profile.save();
    }
  } catch (err) {
    logger.warn(`Failed to sync resume with profile: ${err.message}`);
  }

  return resume;
};

export const activate = async (id) => {
  const resume = await Resume.findById(id);
  if (!resume) throw ApiError.notFound('Resume not found');

  await Resume.updateMany({}, { isActive: false });
  resume.isActive = true;
  await resume.save();

  // Sync with Profile singleton
  try {
    const profile = await Profile.findOne();
    if (profile) {
      profile.resume = {
        url: resume.url,
        publicId: resume.publicId,
        originalName: resume.originalName,
        uploadedAt: new Date(),
      };
      await profile.save();
    }
  } catch (err) {
    logger.warn(`Failed to sync resume with profile: ${err.message}`);
  }

  return resume;
};

export const deleteResume = async (id) => {
  const resume = await Resume.findById(id);
  if (!resume) throw ApiError.notFound('Resume not found');

  const wasActive = resume.isActive;
  await Resume.findByIdAndDelete(id);

  // If deleted resume was active, set latest remaining as active
  if (wasActive) {
    const nextActive = await Resume.findOne().sort({ createdAt: -1 });
    if (nextActive) {
      nextActive.isActive = true;
      await nextActive.save();

      const profile = await Profile.findOne();
      if (profile) {
        profile.resume = {
          url: nextActive.url,
          publicId: nextActive.publicId,
          originalName: nextActive.originalName,
          uploadedAt: nextActive.createdAt,
        };
        await profile.save();
      }
    } else {
      const profile = await Profile.findOne();
      if (profile) {
        profile.resume = undefined;
        await profile.save();
      }
    }
  }

  return { message: 'Resume deleted successfully' };
};
