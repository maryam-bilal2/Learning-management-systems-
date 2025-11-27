import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../model/course.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    const total = await Course.countDocuments();
    console.log(`Total courses: ${total}`);

    const samples = await Course.find().limit(5).select('title educator isPublished createdAt').lean();
    if (samples.length === 0) {
      console.log('No course documents found.');
    } else {
      console.log('Sample courses:');
      samples.forEach((c, i) => {
        const educatorId = c.educator?._id || c.educator || null;
        console.log(`${i + 1}. title: ${c.title || '<no-title>'} | educator: ${educatorId} | published: ${c.isPublished}`);
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('DB check error:', err.message || err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
