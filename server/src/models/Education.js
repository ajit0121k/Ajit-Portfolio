import mongoose from 'mongoose';

/**
 * Education Schema
 */
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  university: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  logo: { url: String, publicId: String },
  location: { type: String, trim: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  grade: { type: String, trim: true },
  description: { type: String },
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
educationSchema.index({ order: 1 });

const Education = mongoose.model('Education', educationSchema);
export default Education;
