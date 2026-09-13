import mongoose from 'mongoose';
import config from '../config/env.js';
import Admin from '../models/Admin.js';

async function updateAdmin() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB:', config.mongodbUri);

  let admin = await Admin.findOne();
  if (!admin) {
    admin = new Admin({
      username: 'admin',
      email: 'ajitkumar2956654@gmail.com',
      passwordHash: 'Ajit@1234',
      role: 'superadmin',
      isActive: true,
      twoFactorEnabled: false
    });
  } else {
    admin.email = 'ajitkumar2956654@gmail.com';
    admin.passwordHash = 'Ajit@1234';
    admin.twoFactorEnabled = false;
    admin.isActive = true;
    admin.failedLoginAttempts = 0;
    admin.lockedUntil = undefined;
    admin.otpCodeHash = undefined;
    admin.otpExpires = undefined;
    admin.temp2FAToken = undefined;
  }

  await admin.save();
  console.log('✅ Admin credentials updated successfully!');
  console.log('📧 Email:', admin.email);
  console.log('🔑 Password set to: Ajit@1234');
  console.log('🛡️ Two-Factor Enabled:', admin.twoFactorEnabled);

  await mongoose.connection.close();
  process.exit(0);
}

updateAdmin().catch((err) => {
  console.error('Failed to update admin:', err);
  process.exit(1);
});
