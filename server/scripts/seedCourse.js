import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import Course from '../model/course.model.js';

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

    // Create or find educator
    const educatorEmail = 'seed-educator@example.local';
    let educator = await User.findOne({ email: educatorEmail });
    if (!educator) {
      const rawPassword = 'devpassword';
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(rawPassword, salt);

      educator = new User({
        name: 'Seed Educator',
        email: educatorEmail,
        password: hashed,
        role: 'educator',
        isVerified: true
      });
      await educator.save();
      console.log('Created educator (password hashed):', educator._id.toString());
    } else {
      console.log('Educator already exists:', educator._id.toString());
    }

    // Create a published course
    const existing = await Course.findOne({ title: 'Seeded Sample Course' });
    if (existing) {
      console.log('Sample course already exists:', existing._id.toString());
    } else {
      const course = new Course({
        title: 'Seeded Sample Course',
        description: 'This is a seeded course for local development and testing.',
        price: 0,
        discount: 0,
        thumbnail: '',
        educator: educator._id,
        isPublished: true,
        ratings: [],
        enrolledStudents: [],
        lectures: [],
        totalDuration: 60,
        chapters: []
      });
      await course.save();
      console.log('Created sample course:', course._id.toString());
    }

    // Finish
    const courses = await Course.find({}).limit(5).populate('educator', 'email name');
    console.log('Sample of courses in DB:', courses.map(c => ({ id: c._id.toString(), title: c.title, published: c.isPublished, educator: c.educator?.email })));

    await mongoose.disconnect();
    console.log('Disconnected, done.');
    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
