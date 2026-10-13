import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import config from '../config/env.js';

const MONGODB_URI = config.mongodbUri || process.env.MONGODB_URI;

async function updateAdmin() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

  let admins = await Admin.find();
  if (admins.length === 0) {
    const admin = new Admin({
      username: 'ajitkumar2956654',
      email: 'ajitkumar2956654@gmail.com',
      mobile: '7379247197',
      passwordHash: 'Ajit9792625929',
      role: 'superadmin',
      isActive: true,
      twoFactorEnabled: false
    });
    await admin.save();
    console.log('✅ Created new Admin account');
  } else {
    for (const admin of admins) {
      admin.email = 'ajitkumar2956654@gmail.com';
      admin.passwordHash = 'Ajit9792625929';
      admin.mobile = '7379247197';
      admin.twoFactorEnabled = false;
      admin.isActive = true;
      admin.failedLoginAttempts = 0;
      admin.lockedUntil = undefined;
      admin.otpCodeHash = undefined;
      admin.otpExpires = undefined;
      admin.temp2FAToken = undefined;
      await admin.save();
      console.log('✅ Updated admin user:', admin.email);
    }
  }

  // Verify comparePassword
  const verifiedAdmin = await Admin.findOne({ email: 'ajitkumar2956654@gmail.com' }).select('+passwordHash');
  const isMatch = await verifiedAdmin.comparePassword('Ajit9792625929');
  console.log('🔑 Password verification test result:', isMatch ? 'PASSED (MATCH)' : 'FAILED');

  await mongoose.connection.close();
  process.exit(isMatch ? 0 : 1);
}

updateAdmin().catch((err) => {
  console.error('Failed to update admin:', err);
  process.exit(1);
});
