import express from 'express';
import { getAllCoursesDebug } from '../controllers/debug.controllers.js';

const debugRouter = express.Router();

// GET /api/debug/courses - returns all courses (including unpublished)
debugRouter.get('/courses', getAllCoursesDebug);

export default debugRouter;
