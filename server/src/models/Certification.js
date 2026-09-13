import mongoose from 'mongoose';

/**
 * Certification Schema
 */
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issuingOrganization: { type: String, required: true, trim: true },
  credentialId: { type: String, trim: true },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  neverExpires: { type: Boolean, default: false },
  credentialUrl: { type: String },
  verificationUrl: { type: String },
  badgeImage: { url: String, publicId: String },
  certificatePdf: { url: String, publicId: String },
  description: { type: String },
  skills: [{ type: String }],
  featured: { type: Boolean, default: false },
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
certificationSchema.index({ order: 1 });

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
