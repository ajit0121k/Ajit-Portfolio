import mongoose from 'mongoose';

/**
 * Experience Schema
 */
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  companyLogo: { url: String, publicId: String },
  role: { type: String, required: true, trim: true },
  employmentType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'], 
    default: 'Full-time' 
  },
  location: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  responsibilities: [{ type: String }],
  technologies: [{ type: String }],
  companyWebsite: { type: String },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
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

// Indexes
experienceSchema.index({ order: 1 });
experienceSchema.index({ visible: 1 });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
