import mongoose from 'mongoose';

/**
 * Media Schema
 */
const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String },
  type: { type: String, enum: ['image', 'document', 'video', 'other'], default: 'image' },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true }, // bytes
  width: { type: Number },
  height: { type: Number },
  alt: { type: String, trim: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // only createdAt
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Virtual for formatted size
mediaSchema.virtual('formattedSize').get(function () {
  if (this.size < 1024 * 1024) {
    return (this.size / 1024).toFixed(2) + ' KB';
  }
  return (this.size / (1024 * 1024)).toFixed(2) + ' MB';
});

// Indexes
mediaSchema.index({ type: 1 });
mediaSchema.index({ createdAt: -1 });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
