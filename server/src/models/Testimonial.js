import mongoose from 'mongoose';

/**
 * Testimonial Schema
 */
const testimonialSchema = new mongoose.Schema({
  quote: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  designation: { type: String, trim: true },
  company: { type: String, trim: true },
  avatar: { url: String, publicId: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  website: { type: String, trim: true },
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
testimonialSchema.index({ order: 1, visible: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
