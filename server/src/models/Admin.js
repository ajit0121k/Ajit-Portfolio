import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Admin Schema
 */
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true, 
    trim: true, 
    minlength: [3, 'Username must be at least 3 characters'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  passwordHash: { 
    type: String, 
    required: true, 
    select: false 
  },
  role: { 
    type: String, 
    enum: ['admin', 'superadmin'], 
    default: 'admin' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  refreshTokenHash: { 
    type: String, 
    select: false 
  },
  failedLoginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockedUntil: { 
    type: Date 
  },
  mobile: {
    type: String,
    trim: true,
    default: '7379247197'
  },
  twoFactorEnabled: { 
    type: Boolean, 
    default: false 
  },
  twoFactorSecret: { 
    type: String, 
    select: false 
  },
  otpCodeHash: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  otpMethod: {
    type: String,
    enum: ['mobile', 'email', 'both'],
    default: 'both'
  },
  temp2FAToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.refreshTokenHash;
      delete ret.twoFactorSecret;
      delete ret.otpCodeHash;
      delete ret.otpExpires;
      delete ret.temp2FAToken;
    }
  }
});

// Pre-save hook: hash password with bcryptjs if modified
adminSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

adminSchema.methods.isLocked = function () {
  return !!(this.lockedUntil && this.lockedUntil.getTime() > Date.now());
};

adminSchema.methods.getRemainingLockSeconds = function () {
  if (!this.lockedUntil || this.lockedUntil.getTime() <= Date.now()) return 0;
  return Math.ceil((this.lockedUntil.getTime() - Date.now()) / 1000);
};

adminSchema.methods.incrementFailedAttempts = async function () {
  if (this.isLocked()) return;
  this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
  // Lock after 5 attempts: 10 minutes, then 20m, 40m, up to maximum 60 minutes (1 hour)
  if (this.failedLoginAttempts >= 5) {
    const exponent = this.failedLoginAttempts - 5;
    const multiplier = Math.pow(2, exponent);
    const lockMinutes = Math.min(10 * multiplier, 60);
    this.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
  }
  await this.save();
};

adminSchema.methods.resetFailedAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
