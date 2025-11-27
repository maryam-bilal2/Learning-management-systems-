import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

const emailArg = process.argv[2] || process.env.TARGET_EMAIL || 'seed-student@example.local';

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: emailArg });
    if (!user) {
      console.error('User not found for email:', emailArg);
      await mongoose.disconnect();
      process.exit(1);
    }

    if (user.role === 'educator') {
      console.log('User is already an educator:', emailArg);
      await mongoose.disconnect();
      process.exit(0);
    }

    user.role = 'educator';
    user.isVerified = true;
    await user.save();
    console.log(`Promoted ${emailArg} to educator.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('makeEducator error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
