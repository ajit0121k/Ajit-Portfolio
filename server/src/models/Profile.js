import mongoose from 'mongoose';

/**
 * Profile Schema (Singleton)
 */
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, trim: true },
  tagline: { type: String, trim: true },
  bio: { type: String },
  profileImage: { url: String, publicId: String },
  location: { type: String, trim: true },
  yearsOfExperience: { type: Number, min: 0 },
  availability: { 
    type: String, 
    enum: ['available', 'limited', 'unavailable'], 
    default: 'available' 
  },
  availabilityText: { type: String },
  currentlyBuilding: { type: String },
  currentlyBuildingUrl: { type: String },
  resume: { 
    url: String, 
    publicId: String, 
    originalName: String, 
    uploadedAt: Date 
  },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  socialLinks: {
    github: String,
    linkedin: String,
    leetcode: String,
    twitter: String,
    website: String,
    youtube: String,
    dribbble: String,
    medium: String,
    devto: String
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Static method: find or create singleton
profileSchema.statics.getProfile = async function () {
  let profile = await this.findOne();
  if (!profile) {
    profile = await this.create({ name: 'Admin User' });
  }
  return profile;
};

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
