import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * Project Schema
 */
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  shortDescription: { type: String, trim: true, maxlength: 300 },
  description: { type: String },
  problem: { type: String },
  solution: { type: String },
  architecture: { type: String },
  features: [{ type: String }],
  challenges: { type: String },
  lessonsLearned: { type: String },
  technologies: [{ type: String }],
  frontendTechnologies: [{ type: String }],
  backendTechnologies: [{ type: String }],
  databaseTechnologies: [{ type: String }],
  tools: [{ type: String }],
  coverImage: { url: String, publicId: String, alt: String },
  gallery: [{ url: String, publicId: String, alt: String, caption: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  featured: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  category: { type: String, trim: true, default: 'Web Application' },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  publishedAt: { type: Date },
  versions: [{ 
    data: mongoose.Schema.Types.Mixed, 
    savedAt: { type: Date, default: Date.now }, 
    version: Number 
  }]
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

// Pre-validate hook: auto-generate slug from title using slugify if not set
projectSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Pre-save hook: if status changes to 'published' and publishedAt not set, set publishedAt
// Also trim versions array to keep last 10
projectSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.versions && this.versions.length > 10) {
    this.versions = this.versions.slice(-10);
  }
  
  next();
});

projectSchema.index({ status: 1, order: 1 });
projectSchema.index({ featured: 1, status: 1 });
projectSchema.index({ status: 1, publishedAt: -1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
