import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * BlogPost Schema
 */
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, trim: true, maxlength: 500 },
  content: { type: String, required: true },
  coverImage: { url: String, publicId: String, alt: String },
  tags: [{ type: String, trim: true, lowercase: true }],
  category: { type: String, trim: true },
  author: { type: String, default: 'Admin' },
  readingTime: { type: Number },
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

// Pre-validate hook
blogPostSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Pre-save hook
blogPostSchema.pre('save', function (next) {
  // Calculate reading time (assuming ~200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Manage versions limit
  if (this.versions && this.versions.length > 10) {
    this.versions = this.versions.slice(-10);
  }

  next();
});

// Indexes
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1, status: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
