import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import Course from '../model/course.model.js';
import Chapter from '../model/chapter.model.js';
import Lecture from '../model/lecture.model.js';
import Purchase from '../model/purchase.model.js';
import UserCourseProgress from '../model/courseProgress.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

const TARGET_EDUCATOR_EMAIL = process.env.SEED_TARGET_EMAIL || 'seed-educator@example.local';
const STUDENT_EMAIL = process.env.SEED_STUDENT_EMAIL || 'seed-student@example.local';

const extraCourses = [
  { title: 'Dev: TypeScript Basics', description: 'Intro to TypeScript for JavaScript devs.', price: 49, totalDuration: 90 },
  { title: 'Dev: Python for Web', description: 'Build web apps with Flask and FastAPI.', price: 129, totalDuration: 200 },
  { title: 'Dev: Docker & Kubernetes', description: 'Containerize and orchestrate your apps.', price: 179, totalDuration: 260 },
  { title: 'Dev: Testing with Jest', description: 'Write reliable tests for JavaScript projects.', price: 39, totalDuration: 80 }
];

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log('Connected to MongoDB');

    let educator = await User.findOne({ email: TARGET_EDUCATOR_EMAIL });
    if (!educator) {
      educator = new User({ name: 'Seed Educator', email: TARGET_EDUCATOR_EMAIL, password: 'devpassword', role: 'educator', isVerified: true });
      await educator.save();
      console.log('Created educator:', TARGET_EDUCATOR_EMAIL);
    }

    let student = await User.findOne({ email: STUDENT_EMAIL });
    if (!student) {
      student = new User({ name: 'Seed Student', email: STUDENT_EMAIL, password: 'devpassword', role: 'student', isVerified: true });
      await student.save();
      console.log('Created student:', STUDENT_EMAIL);
    }

    const createdCourses = [];
    for (const c of extraCourses) {
      const exists = await Course.findOne({ title: c.title, educator: educator._id });
      if (exists) {
        console.log('Course exists, skipping:', c.title);
        createdCourses.push(exists);
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

      // create a chapter
      const chapter = new Chapter({ course: course._id, chapterId: 'ch1', chapterTitle: 'Introduction', chapterContent: [] });
      await chapter.save();

      // create two lectures
      const lecture1 = new Lecture({ course: course._id, chapter: chapter._id, title: 'Intro', videoUrl: 'https://example.com/video1.mp4', duration: '10:00', order: 1 });
      const lecture2 = new Lecture({ course: course._id, chapter: chapter._id, title: 'Deep Dive', videoUrl: 'https://example.com/video2.mp4', duration: '20:00', order: 2 });
      await lecture1.save();
      await lecture2.save();

      // link lectures to chapter and course
      chapter.chapterContent = [lecture1._id, lecture2._id];
      await chapter.save();

      course.lectures = [lecture1._id, lecture2._id];
      course.chapters = [chapter._id];
      await course.save();

      createdCourses.push(course);
    }

    // Create purchases and course progress for the student for the first two created courses
    for (let i = 0; i < Math.min(2, createdCourses.length); i++) {
      const course = createdCourses[i];
      const existingPurchase = await Purchase.findOne({ user: student._id, course: course._id });
      if (!existingPurchase) {
        const purchase = new Purchase({ user: student._id, course: course._id, price: course.price });
        await purchase.save();
        console.log('Created purchase for student on course:', course.title);
      }

      // ensure student's enrolledCourse array contains the course
      if (!student.enrolledCourse) student.enrolledCourse = [];
      if (!student.enrolledCourse.includes(course._id)) {
        student.enrolledCourse.push(course._id);
      }

      const existingProgress = await UserCourseProgress.findOne({ userId: student._id, courseId: course._id });
      if (!existingProgress) {
        const lectureIds = course.lectures || [];
        const progress = new UserCourseProgress({
          userId: student._id,
          courseId: course._id,
          completed: false,
          progress: 20,
          completedLectures: lectureIds.slice(0,1).map(lid => ({ lectureId: lid, chapterId: course.chapters[0], chapter: 1, lecture: 1 })),
          lastPosition: { chapter: 1, lecture: 1 }
        });
        await progress.save();
        console.log('Created course progress for student on course:', course.title);
      }
    }

    await student.save();

    const total = await Course.countDocuments({ educator: educator._id });
    console.log(`Total courses for ${TARGET_EDUCATOR_EMAIL}: ${total}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed extra data error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
