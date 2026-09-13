import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import * as activityService from './activityService.js';
import * as emailService from './emailService.js';
import logger from '../utils/logger.js';

export const STATIC_ADMIN_MOBILE = config.staticAuth?.mobile || '7379247197';
export const STATIC_ADMIN_EMAIL = (config.staticAuth?.email || 'ajitkumar@gmail.com').toLowerCase().trim();

/**
 * Normalize input identifier (mobile number or email)
 * @param {string} raw
 * @returns {string}
 */
export const normalizeIdentifier = (raw) => {
  if (!raw) return '';
  const str = String(raw).trim();
  // Check if it looks like a phone number
  if (/^(\+91|0)?[0-9\s\-]+$/.test(str)) {
    const digits = str.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
  }
  return str.toLowerCase();
};

/**
 * Verify if identifier belongs to the authorized static admin
 * @param {string} rawIdentifier
 * @returns {{ isAuthorized: boolean, type: string, destination: string }}
 */
export const checkAuthorizedAdmin = (rawIdentifier) => {
  const normalized = normalizeIdentifier(rawIdentifier);
  if (normalized === STATIC_ADMIN_MOBILE) {
    return { isAuthorized: true, type: 'mobile', destination: STATIC_ADMIN_MOBILE };
  }
  if (
    normalized === STATIC_ADMIN_EMAIL ||
    normalized === (config.admin.email || '').toLowerCase()
  ) {
    return { isAuthorized: true, type: 'email', destination: STATIC_ADMIN_EMAIL };
  }
  return { isAuthorized: false };
};

/**
 * Hash a token using SHA-256
 * @param {string} token
 * @returns {string}
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a JWT access token
 * @param {string} adminId
 * @returns {string}
 */
export const generateAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires,
  });
};

/**
 * Generate a refresh token, hash it, and store in DB
 * @param {string} adminId
 * @returns {Promise<string>}
 */
export const generateRefreshToken = async (adminId) => {
  const token = jwt.sign({ id: adminId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpires,
  });
  const hashedToken = hashToken(token);
  await Admin.findByIdAndUpdate(adminId, { refreshTokenHash: hashedToken });
  return token;
};

/**
 * Send 2-Step Verification OTP to registered Mobile (7379247197) or Email (ajitkumar@gmail.com)
 * @param {{ identifier: string, method?: string }} params
 */
export const sendLoginOtp = async ({ identifier, method = 'mobile' }) => {
  const authCheck = checkAuthorizedAdmin(identifier);
  if (!authCheck.isAuthorized) {
    throw ApiError.forbidden(
      'Access Denied. Admin Two-Step verification is strictly restricted to registered Admin credentials (Mobile: 7379247197 / Email: ajitkumar@gmail.com).'
    );
  }

  // Find admin document
  let admin = await Admin.findOne({
    $or: [
      { email: STATIC_ADMIN_EMAIL },
      { email: config.admin.email },
      { mobile: STATIC_ADMIN_MOBILE },
      { username: 'admin' },
    ],
  }).select('+otpCodeHash +otpExpires +temp2FAToken');

  if (!admin) {
    throw ApiError.notFound('Admin account not initialized.');
  }

  if (!admin.isActive) {
    throw ApiError.forbidden('Account is deactivated.');
  }

  if (admin.isLocked()) {
    throw ApiError.forbidden('Account is temporarily locked. Try again later.');
  }

  // Generate 6-digit numeric OTP
  const otp = String(crypto.randomInt(100000, 999999));
  admin.otpCodeHash = hashToken(otp);
  admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  admin.otpMethod = authCheck.type;
  if (!admin.mobile) admin.mobile = STATIC_ADMIN_MOBILE;
  await admin.save();

  // Send via Email if requested or identifier is email
  if (authCheck.type === 'email' || method === 'email') {
    await emailService.sendOtpEmail(STATIC_ADMIN_EMAIL, otp);
    console.log(`\n=========================================`);
    console.log(`📧 [ADMIN 2-STEP EMAIL OTP] Code for ${STATIC_ADMIN_EMAIL}: [ ${otp} ]`);
    console.log(`=========================================\n`);
  }

  // Send via SMS / Mobile if requested or identifier is mobile
  if (authCheck.type === 'mobile' || method === 'mobile') {
    console.log(`\n=========================================`);
    console.log(`📱 [ADMIN 2-STEP SMS OTP] Code for ${STATIC_ADMIN_MOBILE}: [ ${otp} ]`);
    console.log(`=========================================\n`);
  }

  return {
    success: true,
    message: `Two-Step Verification OTP sent successfully to registered ${authCheck.type === 'mobile' ? 'Mobile' : 'Email'} (${authCheck.destination})`,
    destination: authCheck.destination,
    method: authCheck.type,
    devOtp: config.env === 'development' ? otp : undefined,
  };
};

/**
 * Verify 2-Step OTP and complete admin authentication
 * @param {{ identifier?: string, otp: string, tempToken?: string }} params
 */
export const verifyLoginOtp = async ({ identifier, otp, tempToken }) => {
  if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
    throw ApiError.badRequest('Please enter a valid 6-digit verification code.');
  }

  let admin;

  if (tempToken) {
    try {
      const decoded = jwt.verify(tempToken, config.jwt.accessSecret);
      admin = await Admin.findById(decoded.id).select('+otpCodeHash +otpExpires +temp2FAToken');
    } catch (err) {
      throw ApiError.unauthorized('Verification session expired. Please sign in again.');
    }
  } else {
    const authCheck = checkAuthorizedAdmin(identifier);
    if (!authCheck.isAuthorized) {
      throw ApiError.forbidden('Access denied. Unrecognized Admin identifier.');
    }
    admin = await Admin.findOne({
      $or: [
        { email: STATIC_ADMIN_EMAIL },
        { email: config.admin.email },
        { mobile: STATIC_ADMIN_MOBILE },
        { username: 'admin' },
      ],
    }).select('+otpCodeHash +otpExpires +temp2FAToken');
  }

  if (!admin) {
    throw ApiError.unauthorized('Admin account not found.');
  }

  if (admin.isLocked()) {
    throw ApiError.forbidden('Account is temporarily locked. Try again later.');
  }

  // Check expiry
  if (!admin.otpExpires || admin.otpExpires.getTime() < Date.now()) {
    throw ApiError.badRequest('Verification code has expired. Please request a new code.');
  }

  // Verify OTP hash
  const inputHash = hashToken(otp.trim());
  if (admin.otpCodeHash !== inputHash) {
    await admin.incrementFailedAttempts();
    throw ApiError.unauthorized('Invalid verification code. Please check and try again.');
  }

  // Success: Clear OTP & 2FA fields
  admin.otpCodeHash = undefined;
  admin.otpExpires = undefined;
  admin.temp2FAToken = undefined;
  admin.lastLogin = new Date();
  await admin.resetFailedAttempts();
  await admin.save();

  // Generate tokens
  const accessToken = generateAccessToken(admin._id);
  const refreshToken = await generateRefreshToken(admin._id);

  // Audit activity log
  try {
    await activityService.log({
      adminId: admin._id,
      action: 'LOGIN_2FA',
      entity: 'Admin',
      entityId: admin._id,
      description: 'Admin logged in via Two-Step Verification',
    });
  } catch (e) {
    // Non-blocking
  }

  return { admin, accessToken, refreshToken };
};

/**
 * Authenticate admin with email and password (triggers 2-step verification)
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ requires2FA: boolean, tempToken?: string, message: string, devOtp?: string }>}
 */
export const login = async ({ email, password }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Find admin with password field included
  const admin = await Admin.findOne({
    $or: [
      { email: normalizedEmail },
      { email: STATIC_ADMIN_EMAIL },
      { email: config.admin.email },
      { username: 'admin' },
    ],
  }).select('+passwordHash +otpCodeHash +otpExpires +temp2FAToken');

  if (!admin) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (!admin.isActive) {
    throw ApiError.forbidden('Account is deactivated');
  }

  // Check if account is locked
  if (admin.isLocked()) {
    throw ApiError.forbidden('Account is temporarily locked. Try again later.');
  }

  // Compare password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    await admin.incrementFailedAttempts();
    throw ApiError.unauthorized('Invalid credentials');
  }

  // If Two-Factor is disabled, log in directly
  if (!admin.twoFactorEnabled) {
    admin.lastLogin = new Date();
    await admin.resetFailedAttempts();
    await admin.save();

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = await generateRefreshToken(admin._id);

    try {
      await activityService.log({
        adminId: admin._id,
        action: 'LOGIN',
        entity: 'Admin',
        entityId: admin._id,
        description: 'Admin logged in with Email and Password',
      });
    } catch (e) {
      // Non-blocking
    }

    return { admin, accessToken, refreshToken, requires2FA: false };
  }

  // Generate Two-Step Verification OTP
  const otp = String(crypto.randomInt(100000, 999999));
  const tempToken = jwt.sign({ id: admin._id, step: '2FA' }, config.jwt.accessSecret, {
    expiresIn: '10m',
  });

  admin.otpCodeHash = hashToken(otp);
  admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  admin.temp2FAToken = hashToken(tempToken);
  if (!admin.mobile) admin.mobile = STATIC_ADMIN_MOBILE;
  await admin.save();

  // Dispatch OTP to static email & mobile
  await emailService.sendOtpEmail(STATIC_ADMIN_EMAIL, otp);
  console.log(`\n=========================================`);
  console.log(`🔐 [ADMIN 2-STEP VERIFICATION REQUIRED]`);
  console.log(`📱 SMS Destination: ${STATIC_ADMIN_MOBILE} (Code: ${otp})`);
  console.log(`📧 Email Destination: ${STATIC_ADMIN_EMAIL} (Code: ${otp})`);
  console.log(`=========================================\n`);

  return {
    requires2FA: true,
    tempToken,
    message: `Two-Step Verification required. A 6-digit code has been sent to your registered Mobile (${STATIC_ADMIN_MOBILE}) and Email (${STATIC_ADMIN_EMAIL}).`,
    destinations: {
      mobile: STATIC_ADMIN_MOBILE,
      email: STATIC_ADMIN_EMAIL,
    },
    devOtp: config.env === 'development' ? otp : undefined,
  };
};

/**
 * Refresh the access token using a refresh token from cookie
 * @param {string} tokenFromCookie
 * @returns {Promise<{ accessToken: string }>}
 */
export const refreshToken = async (tokenFromCookie) => {
  if (!tokenFromCookie) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  try {
    // Verify the refresh token JWT
    const decoded = jwt.verify(tokenFromCookie, config.jwt.refreshSecret);

    // Check if the hashed token matches what's stored
    const hashedToken = hashToken(tokenFromCookie);
    const admin = await Admin.findById(decoded.id).select('+refreshTokenHash');

    if (!admin || admin.refreshTokenHash !== hashedToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    const accessToken = generateAccessToken(admin._id);
    return { accessToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
};

/**
 * Logout admin - clear refresh token
 * @param {string} adminId
 */
export const logout = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, { refreshTokenHash: null });

  try {
    await activityService.log({
      adminId,
      action: 'LOGOUT',
      entity: 'Admin',
      entityId: adminId,
      description: 'Admin logged out',
    });
  } catch (e) {
    // Non-blocking
  }
};
