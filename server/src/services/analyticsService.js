import AnalyticsEvent from '../models/AnalyticsEvent.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Testimonial from '../models/Testimonial.js';
import Message from '../models/Message.js';
import Media from '../models/Media.js';
import ActivityLog from '../models/ActivityLog.js';
import Profile from '../models/Profile.js';
import SiteSettings from '../models/SiteSettings.js';
import ApiError from '../utils/ApiError.js';

export const trackEvent = async (eventData) => {
  if (eventData.type === 'pageview') eventData.type = 'page_view';
  if (eventData.type === 'projectview') eventData.type = 'project_view';
  if (eventData.type === 'blogview') eventData.type = 'blog_view';
  
  const event = new AnalyticsEvent(eventData);
  await event.save();
  return event;
};

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [viewsToday, viewsThisWeek, viewsThisMonth] = await Promise.all([
    AnalyticsEvent.countDocuments({ type: 'page_view', timestamp: { $gte: startOfToday } }),
    AnalyticsEvent.countDocuments({ type: 'page_view', timestamp: { $gte: startOfWeek } }),
    AnalyticsEvent.countDocuments({ type: 'page_view', timestamp: { $gte: startOfMonth } })
  ]);

  return { viewsToday, viewsThisWeek, viewsThisMonth };
};

export const getDashboardSummary = async () => {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalSkills,
    totalExperience,
    totalEducation,
    totalCertifications,
    totalTestimonials,
    totalMessages,
    unreadMessages,
    totalMedia,
    recentProjects,
    recentMessages,
    recentActivity,
    profile,
    settings,
    totalActivity
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'published' }),
    Project.countDocuments({ status: 'draft' }),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Education.countDocuments(),
    Certification.countDocuments(),
    Testimonial.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ status: 'unread' }),
    Media.countDocuments(),
    Project.find().sort({ createdAt: -1 }).limit(5).select('title slug coverImage status publishedAt createdAt technologies'),
    Message.find().sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),
    ActivityLog.find().sort({ createdAt: -1 }).limit(6),
    Profile.findOne(),
    SiteSettings.findOne(),
    ActivityLog.countDocuments()
  ]);

  // Calculate profile completeness
  let score = 0;
  if (profile) {
    if (profile.name) score += 10;
    if (profile.title) score += 10;
    if (profile.bio) score += 15;
    if (profile.profileImage?.url) score += 15;
    if (profile.location) score += 10;
    if (profile.email) score += 10;
    if (profile.phone) score += 5;
    if (profile.resume?.url) score += 15;
    if (profile.socialLinks?.github || profile.socialLinks?.linkedin) score += 10;
  }

  return {
    counts: {
      projects: totalProjects,
      publishedProjects,
      draftProjects,
      skills: totalSkills,
      experience: totalExperience,
      education: totalEducation,
      certifications: totalCertifications,
      testimonials: totalTestimonials,
      messages: totalMessages,
      unreadMessages,
      media: totalMedia,
      activity: totalActivity,
    },
    profile,
    recentProjects,
    recentMessages,
    recentActivity,
    profileCompleteness: Math.min(score, 100),
    settings: {
      siteName: settings?.siteName || 'Portfolio',
      maintenanceMode: settings?.maintenanceMode || false,
      sectionVisibility: settings?.sectionVisibility || {},
    }
  };
};

export const getPopularPages = async (period = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - period);

  return AnalyticsEvent.aggregate([
    { $match: { type: 'page_view', timestamp: { $gte: since }, path: { $ne: null } } },
    { $group: { _id: '$path', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 10 }
  ]);
};

export const getPopularProjects = async (period = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - period);

  return AnalyticsEvent.aggregate([
    { $match: { type: 'project_view', timestamp: { $gte: since }, projectId: { $ne: null } } },
    { $group: { _id: '$projectId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 10 }
  ]);
};

export const getTrafficSources = async (period = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - period);

  return AnalyticsEvent.aggregate([
    { $match: { type: 'page_view', timestamp: { $gte: since }, referrer: { $ne: null } } },
    { $group: { _id: '$referrer', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
};
