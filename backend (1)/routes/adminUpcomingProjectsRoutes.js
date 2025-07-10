import express from 'express';
import { 
  getAllUpcomingProjects, 
  getUpcomingProjectById, 
  createUpcomingProject, 
  updateUpcomingProject, 
  deleteUpcomingProject, 
  exportRegistrations 
} from '../controller/adminUpcomingProjectsController.js';
import adminAuth from '../middleware/adminauth.js';

const adminUpcomingRouter = express.Router();

// Apply authentication and admin middleware to all routes
// adminUpcomingRouter.use(authMiddleware);

// Get all upcoming projects (admin)
adminUpcomingRouter.get('/admin/upcoming-projects',adminAuth, getAllUpcomingProjects);

// Get single project details (admin)
adminUpcomingRouter.get('/admin/upcoming-projects/:id', adminAuth, getUpcomingProjectById);

// Create new upcoming project
adminUpcomingRouter.post('/admin/upcoming-projects/create',adminAuth, createUpcomingProject);

// Update upcoming project
adminUpcomingRouter.put('/admin/upcoming-projects/update/:id',adminAuth, updateUpcomingProject);

// Delete upcoming project
adminUpcomingRouter.delete('/admin/upcoming-projects/delete/:id',adminAuth, deleteUpcomingProject);

// Export registrations as CSV
adminUpcomingRouter.get('/admin/upcoming-projects/export-registrations/:id', adminAuth, exportRegistrations);

export default adminUpcomingRouter;