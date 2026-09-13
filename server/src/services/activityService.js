import ActivityLog from '../models/ActivityLog.js';
import ApiError from '../utils/ApiError.js';

export const log = async (data) => {
  const activity = new ActivityLog(data);
  await activity.save();
  return activity;
};

export const getRecent = async (limit = 10) => {
  return ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
};

export const getAll = async (filters = {}) => {
  const { type, page = 1, limit = 20 } = filters;
  const query = {};
  if (type) query.type = type;

  const skip = (page - 1) * limit;
  const activities = await ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await ActivityLog.countDocuments(query);

  return { activities, total, page, totalPages: Math.ceil(total / limit) };
};

// Aliases matching activityController method names
export const getRecentActivity = getRecent;
export const getAllActivity = getAll;
