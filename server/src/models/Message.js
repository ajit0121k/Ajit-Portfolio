import mongoose from 'mongoose';

/**
 * Message Schema
 */
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
  replied: { type: Boolean, default: false },
  replyMessage: { type: String },
  repliedAt: { type: Date },
  ipHash: { type: String },
  userAgent: { type: String }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Use createdAt as timestamps per spec
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Indexes
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
