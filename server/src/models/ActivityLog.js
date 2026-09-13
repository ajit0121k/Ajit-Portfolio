import mongoose from 'mongoose';

/**
 * ActivityLog Schema
 */
const activityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  action: { 
    type: String, 
    required: true, 
    enum: [
      'LOGIN', 'LOGOUT', 'CREATE_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT', 
      'PUBLISH_PROJECT', 'ARCHIVE_PROJECT', 'CREATE_SKILL', 'UPDATE_SKILL', 
      'DELETE_SKILL', 'CREATE_EXPERIENCE', 'UPDATE_EXPERIENCE', 'DELETE_EXPERIENCE', 
      'CREATE_EDUCATION', 'UPDATE_EDUCATION', 'DELETE_EDUCATION', 'CREATE_CERTIFICATION', 
      'UPDATE_CERTIFICATION', 'DELETE_CERTIFICATION', 'CREATE_TESTIMONIAL', 
      'UPDATE_TESTIMONIAL', 'DELETE_TESTIMONIAL', 'UPDATE_PROFILE', 'UPLOAD_MEDIA', 
      'DELETE_MEDIA', 'UPDATE_SETTINGS', 'UPDATE_SEO', 'READ_MESSAGE', 'ARCHIVE_MESSAGE', 
      'DELETE_MESSAGE', 'REPLY_MESSAGE', 'CREATE_BLOG_POST', 'UPDATE_BLOG_POST', 
      'DELETE_BLOG_POST', 'PUBLISH_BLOG_POST'
    ] 
  },
  entity: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  ipHash: { type: String }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only createdAt needed
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Indexes
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL index 90 days

// Static method for logging
activityLogSchema.statics.log = async function ({ adminId, action, entity, entityId, description, ipHash }) {
  return this.create({ adminId, action, entity, entityId, description, ipHash });
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
