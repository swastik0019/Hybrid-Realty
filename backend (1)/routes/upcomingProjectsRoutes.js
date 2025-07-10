import express from 'express';
import { 
  getAllUpcomingProjects, 
  getUpcomingProjectById, 
  registerInterest 
} from '../controller/upcomingProjectsController.js';

const upcomingProjectRouter = express.Router();

// Get all upcoming projects (public)
upcomingProjectRouter.get('/upcoming-projects', getAllUpcomingProjects);

// Get single project details (public)
upcomingProjectRouter.get('/upcoming-projects/:id', getUpcomingProjectById);

// Register interest for a project
upcomingProjectRouter.post('/upcoming-projects/register/:id', registerInterest);

export default upcomingProjectRouter;