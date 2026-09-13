import mongoose from 'mongoose';

/**
 * Skill Schema
 */
const skillSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Tools', 'Other'] 
  },
  name: { type: String, required: true, trim: true },
  icon: { type: String },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Advanced' 
  },
  years: { type: Number, min: 0, default: 1 },
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
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ visible: 1 });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
