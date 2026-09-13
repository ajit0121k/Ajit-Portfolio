import mongoose from 'mongoose';

/**
 * Resume Schema for dedicated resume / CV version management
 */
const resumeSchema = new mongoose.Schema({
  originalName: { type: String, required: true, trim: true },
  filename: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  publicId: { type: String },
  size: { type: Number },
  mimeType: { type: String, default: 'application/pdf' },
  isActive: { type: Boolean, default: false },
  version: { type: Number, default: 1 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
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

resumeSchema.index({ isActive: 1 });
resumeSchema.index({ createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
