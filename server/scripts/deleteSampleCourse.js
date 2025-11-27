import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../model/course.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment. Set it in .env before running this script.');
  process.exit(1);
}

const COURSE_ID = '691229be33c07a8154c70e13';

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    const res = await Course.deleteOne({ _id: COURSE_ID });
    console.log('Delete result:', res);

    await mongoose.disconnect();
    console.log('Disconnected, done.');
    process.exit(0);
  } catch (err) {
    console.error('Delete script error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
