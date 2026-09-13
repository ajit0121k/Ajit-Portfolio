import path from 'path';
import fs from 'fs';
import Media from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const getAll = async (filters = {}) => {
  const { type, page = 1, limit = 20, search } = filters;
  const query = {};
  if (type && type !== 'all') query.type = type;
  if (search) {
    query.$or = [
      { originalName: { $regex: search, $options: 'i' } },
      { alt: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [mediaItems, total] = await Promise.all([
    Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Media.countDocuments(query),
  ]);

  return {
    media: mediaItems,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const upload = async (file, adminId, alt = '') => {
  if (!file) throw ApiError.badRequest('No file provided');

  let fileUrl = '';
  let publicId = null;
  let width = null;
  let height = null;

  const isImage = file.mimetype.startsWith('image/');
  const isDocument = file.mimetype.includes('pdf') || file.mimetype.includes('document');
  const type = isImage ? 'image' : isDocument ? 'document' : 'other';

  // If Cloudinary configured and buffer available
  if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio/media',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        if (file.buffer) {
          stream.end(file.buffer);
        } else if (file.path) {
          fs.createReadStream(file.path).pipe(stream);
        } else {
          reject(new Error('File content not found'));
        }
      });

      const result = await uploadPromise;
      fileUrl = result.secure_url;
      publicId = result.public_id;
      width = result.width || null;
      height = result.height || null;
    } catch (cloudErr) {
      logger.warn(`Cloudinary upload failed, using local storage: ${cloudErr.message}`);
    }
  }

  // Fallback to local storage if Cloudinary not available or failed
  if (!fileUrl) {
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, filename);

    if (file.buffer) {
      fs.writeFileSync(targetPath, file.buffer);
    } else if (file.path && file.path !== targetPath) {
      fs.copyFileSync(file.path, targetPath);
    }

    fileUrl = `/uploads/${filename}`;
  }

  const media = await Media.create({
    filename: file.filename || file.originalname,
    originalName: file.originalname,
    url: fileUrl,
    publicId,
    type,
    mimeType: file.mimetype,
    size: file.size,
    width,
    height,
    alt: alt || file.originalname,
    uploadedBy: adminId,
  });

  return media;
};

export const getById = async (id) => {
  const media = await Media.findById(id);
  if (!media) throw ApiError.notFound('Media not found');
  return media;
};

export const deleteMedia = async (id) => {
  const media = await Media.findById(id);
  if (!media) throw ApiError.notFound('Media not found');

  if (media.publicId && config.cloudinary.cloudName) {
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (err) {
      logger.warn(`Failed to delete from Cloudinary: ${err.message}`);
    }
  }

  // If local file, remove it
  if (media.url && media.url.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), media.url.replace('/uploads/', 'uploads/'));
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {}
    }
  }

  await Media.findByIdAndDelete(id);
  return media;
};

export { deleteMedia as delete };

// Aliases matching mediaController method names
export const getAllMedia = getAll;
export const uploadMedia = upload;
export const getMediaById = getById;
