import SiteSettings from '../models/SiteSettings.js';
import ApiError from '../utils/ApiError.js';

export const getSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const updateSettings = async (data) => {
  const updateData = { ...data };
  delete updateData._id;
  delete updateData.id;

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(updateData);
    return settings;
  }

  // Handle nested objects explicitly so Mongoose detects changes accurately
  if (updateData.sectionVisibility) {
    const prev = settings.sectionVisibility?.toObject ? settings.sectionVisibility.toObject() : (settings.sectionVisibility || {});
    settings.sectionVisibility = { ...prev, ...updateData.sectionVisibility };
    settings.markModified('sectionVisibility');
    delete updateData.sectionVisibility;
  }

  if (updateData.contactSettings) {
    const prev = settings.contactSettings?.toObject ? settings.contactSettings.toObject() : (settings.contactSettings || {});
    settings.contactSettings = { ...prev, ...updateData.contactSettings };
    settings.markModified('contactSettings');
    delete updateData.contactSettings;
  }

  if (updateData.portfolio) {
    const prev = settings.portfolio?.toObject ? settings.portfolio.toObject() : (settings.portfolio || {});
    settings.portfolio = { ...prev, ...updateData.portfolio };
    settings.markModified('portfolio');
    delete updateData.portfolio;
  }

  if (updateData.appearance) {
    const prev = settings.appearance?.toObject ? settings.appearance.toObject() : (settings.appearance || {});
    settings.appearance = { ...prev, ...updateData.appearance };
    settings.markModified('appearance');
    delete updateData.appearance;
  }

  if (typeof updateData.maintenanceMode === 'boolean') {
    settings.maintenanceMode = updateData.maintenanceMode;
    settings.markModified('maintenanceMode');
  }

  if (typeof updateData.maintenanceMessage === 'string') {
    settings.maintenanceMessage = updateData.maintenanceMessage;
    settings.markModified('maintenanceMessage');
  }

  Object.assign(settings, updateData);
  await settings.save();
  return settings;
};

export const getPublicSettings = async () => {
  const settings = await getSettings();
  const safeSettings = settings.toObject();
  
  return safeSettings;
};
