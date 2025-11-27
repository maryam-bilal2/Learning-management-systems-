import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment. Set it in .env before running this script.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    const educators = await User.find({ role: 'educator' }).select('name email _id').lean();
    if (!educators || educators.length === 0) {
      console.log('No educator users found in the database.');
    } else {
      console.log('Educators found:');
      educators.forEach(e => {
        console.log(`- ${e.name || '<no-name>'} | ${e.email || '<no-email>'} | id: ${e._id}`);
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error listing educators:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
