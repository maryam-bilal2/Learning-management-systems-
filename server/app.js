import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudnary.js';

// Routers
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import chapterRouter from './routes/chapter.routes.js';
import lectureRouter from './routes/lecture.routes.js';
import videoRouter from './routes/video.routes.js';
import paymentRouter from './routes/payment.routes.js';
import debugRouter from './routes/debug.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Increase server timeout for large uploads
app.timeout = 600000; // 10 minutes

// Logging
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server (default)
    'http://localhost:5174', // alternate Vite dev server port (if used)
    
  ],
  credentials: true
}));

// Parse cookies
app.use(cookieParser());

// Conditional body parser for file upload routes
app.use((req, res, next) => {
  const isFileUploadRoute = (
    (req.path.includes('/api/lecture/') && req.method === 'POST') || 
    (req.path.includes('/api/course/') && req.path.includes('/update') && req.method === 'PATCH') ||
    (req.path.includes('/api/user/profile/upload-avatar') && req.method === 'POST') ||
    (req.path.includes('/api/video/upload') && req.method === 'POST')
  );

  if (isFileUploadRoute && req.get('Content-Type')?.includes('multipart/form-data')) {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);
    return next();
  }

  express.json({ limit: '600mb' })(req, res, next);
});

app.use((req, res, next) => {
  const isFileUploadRoute = (
    (req.path.includes('/api/lecture/') && req.method === 'POST') || 
    (req.path.includes('/api/course/') && req.path.includes('/update') && req.method === 'PATCH') ||
    (req.path.includes('/api/user/profile/upload-avatar') && req.method === 'POST') ||
    (req.path.includes('/api/video/upload') && req.method === 'POST')
  );

  if (isFileUploadRoute && req.get('Content-Type')?.includes('multipart/form-data')) {
    req.setTimeout(300000);
    res.setTimeout(300000);
    return next();
  }

  express.urlencoded({ limit: '600mb', extended: true })(req, res, next);
});

// Connect to MongoDB & Cloudinary
connectDB();
connectCloudinary();

// Basic test route
app.get('/', (req, res) => {
  res.send("Backend is running!");
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/chapter', chapterRouter);
app.use('/api/lecture', lectureRouter);
app.use('/api/video', videoRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/debug', debugRouter); // dev-only debug routes

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Set long timeouts for large uploads
server.timeout = 600000;
server.keepAliveTimeout = 650000;
server.headersTimeout = 660000;
