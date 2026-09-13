import mongoose from 'mongoose';

/**
 * AnalyticsEvent Schema
 */
const analyticsEventSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: [
      'page_view', 'project_view', 'resume_download', 
      'external_link_click', 'contact_submit', 'blog_view'
    ] 
  },
  path: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' },
  referrer: { type: String },
  device: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
  browser: { type: String },
  country: { type: String },
  sessionId: { type: String }, // anonymous, hashed
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: false,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Indexes
analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ type: 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); // TTL index 365 days

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;
