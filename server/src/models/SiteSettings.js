import mongoose from 'mongoose';

/**
 * SiteSettings Schema (Singleton)
 */
const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'My Portfolio' },
  websiteLogo: { type: String, default: '' },
  websiteDescription: { type: String, default: '' },
  authorName: { type: String, default: 'Ajit Kumar' },
  defaultTheme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  themePreset: { 
    type: String, 
    enum: ['default', 'midnight', 'ocean', 'emerald', 'monochrome'], 
    default: 'default' 
  },
  accentColor: { type: String, default: '#3b82f6' },
  appearance: {
    primaryColor: { type: String, default: '#3b82f6' },
    font: { type: String, default: 'Inter' },
    animationEnabled: { type: Boolean, default: true }
  },
  sectionVisibility: {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
    github: { type: Boolean, default: true },
    currentlyBuilding: { type: Boolean, default: true }
  },
  portfolio: {
    featuredProjectsLimit: { type: Number, default: 6 },
    resumeDownloadButton: { type: Boolean, default: true },
    contactFormEnabled: { type: Boolean, default: true }
  },
  navigation: [{ 
    label: String, 
    href: String, 
    visible: Boolean, 
    order: Number 
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
    twitterHandle: String,
    canonicalUrl: String,
    favicon: String,
    googleVerification: String,
    robots: { type: String, default: 'index, follow' }
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    youtube: String,
    email: String
  },
  contactSettings: {
    enableContactForm: { type: Boolean, default: true },
    enableAutoReply: { type: Boolean, default: false },
    autoReplyMessage: { type: String },
    notifyOnMessage: { type: Boolean, default: true }
  },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'Portfolio is currently undergoing scheduled maintenance. Please check back shortly.' }
}, {
  timestamps: { createdAt: false, updatedAt: true },
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Static method: find or create singleton
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
