import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../model/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

const [,, target = 'all', newPassword] = process.argv;

if (!newPassword) {
  console.error('Usage: node resetEducatorPassword.js <email|all> <newPassword>');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('Password must be at least 6 characters long.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    const hashed = await bcrypt.hash(newPassword, 10);

    if (target === 'all') {
      const educators = await User.find({ role: 'educator' });
      if (!educators.length) {
        console.log('No educator users found.');
      } else {
        for (const e of educators) {
          e.password = hashed;
          await e.save();
          console.log(`Updated password for ${e.email}`);
        }
        console.log(`Total educators updated: ${educators.length}`);
      }
    } else {
      const user = await User.findOne({ email: target });
      if (!user) {
        console.log('User not found for email:', target);
      } else if (user.role !== 'educator') {
        console.log('User found but role is not educator:', user.email, user.role);
      } else {
        user.password = hashed;
        await user.save();
        console.log(`Updated password for ${user.email}`);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
