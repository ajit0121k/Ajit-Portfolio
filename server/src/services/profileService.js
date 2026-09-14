import Profile from '../models/Profile.js';
import Resume from '../models/Resume.js';
import * as mediaService from './mediaService.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const getProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({
      name: 'Developer',
      title: 'Full Stack Engineer',
      tagline: 'Crafting high performance applications',
      availability: 'available',
      socialLinks: {},
      seo: {},
    });
  }
  return profile;
};

export const updateProfile = async (data) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile(data);
  } else {
    Object.assign(profile, data);
  }
  await profile.save();

  // If a resume URL was updated, also sync active status in Resume collection
  if (data.resume?.url) {
    try {
      await Resume.updateMany({}, { isActive: false });
      let existing = await Resume.findOne({ url: data.resume.url });
      if (existing) {
        existing.isActive = true;
        await existing.save();
      } else {
        const count = await Resume.countDocuments();
        await Resume.create({
          originalName: data.resume.originalName || 'Ajit_Kumar_Resume.pdf',
          filename: data.resume.originalName || 'Ajit_Kumar_Resume.pdf',
          url: data.resume.url,
          publicId: data.resume.publicId,
          size: data.resume.size || 7737,
          mimeType: 'application/pdf',
          isActive: true,
          version: count + 1,
        });
      }
    } catch (err) {
      logger.warn(`Failed to sync Resume collection from profile update: ${err.message}`);
    }
  }

  return profile;
};

export const updateProfilePhoto = async (fileData, adminId) => {
  if (!fileData) throw ApiError.badRequest('No file provided');

  const media = await mediaService.upload(fileData, adminId, 'Profile Photo');
  const profile = await getProfile();

  profile.profileImage = {
    url: media.url,
    publicId: media.publicId,
  };
  await profile.save();

  return profile;
};

export const updateResume = async (fileData, adminId) => {
  if (!fileData) throw ApiError.badRequest('No file provided');

  const media = await mediaService.upload(fileData, adminId, 'Resume PDF');
  const profile = await getProfile();

  profile.resume = {
    url: media.url,
    publicId: media.publicId,
    originalName: fileData.originalname,
    uploadedAt: new Date(),
  };
  await profile.save();

  return profile;
};

export const calculateCompleteness = (profile) => {
  if (!profile) return 0;

  const checks = [
    Boolean(profile.name),
    Boolean(profile.title),
    Boolean(profile.tagline),
    Boolean(profile.bio),
    Boolean(profile.profileImage?.url),
    Boolean(profile.location),
    Boolean(profile.yearsOfExperience),
    Boolean(profile.currentlyBuilding),
    Boolean(profile.resume?.url),
    Boolean(profile.email),
    Boolean(profile.socialLinks && Object.values(profile.socialLinks).some((v) => Boolean(v))),
    Boolean(profile.seo?.title || profile.seo?.description),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

export const getProfileCompleteness = async () => {
  const profile = await getProfile();
  return { completeness: calculateCompleteness(profile) };
};
