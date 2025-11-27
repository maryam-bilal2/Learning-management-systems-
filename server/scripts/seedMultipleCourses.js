import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import Course from '../model/course.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

// Email to attach courses to (default to existing seed educator)
const TARGET_EMAIL = process.env.SEED_TARGET_EMAIL || 'seed-educator@example.local';

const coursesToCreate = [
  {
    title: 'Dev: JavaScript Essentials',
    description: 'Learn core JavaScript concepts for web development.',
    price: 0,
    totalDuration: 120,
  },
  {
    title: 'Dev: React from Scratch',
    description: 'A practical guide to building React applications.',
    price: 199,
    totalDuration: 300,
  },
  {
    title: 'Dev: Node.js APIs',
    description: 'Build and deploy RESTful APIs with Node and Express.',
    price: 149,
    totalDuration: 240,
  }
];

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    let educator = await User.findOne({ email: TARGET_EMAIL });
    if (!educator) {
      // create a simple educator account
      educator = new User({
        name: 'Seed Educator',
        email: TARGET_EMAIL,
        password: 'devpassword',
        role: 'educator',
        isVerified: true,
      });
      await educator.save();
      console.log('Created educator:', TARGET_EMAIL);
    } else {
      console.log('Using existing educator:', TARGET_EMAIL);
    }

    for (const c of coursesToCreate) {
      const exists = await Course.findOne({ title: c.title, educator: educator._id });
      if (exists) {
        console.log('Course already exists, skipping:', c.title);
        continue;
      }

      const course = new Course({
        title: c.title,
        description: c.description,
        price: c.price,
        discount: 0,
        thumbnail: '',
        educator: educator._id,
        isPublished: true,
        ratings: [],
        enrolledStudents: [],
        lectures: [],
        totalDuration: c.totalDuration,
        chapters: []
      });
      await course.save();
      console.log('Created course:', course.title);
    }

    const total = await Course.countDocuments({ educator: educator._id });
    console.log(`Total courses for ${TARGET_EMAIL}: ${total}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed multiple error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
