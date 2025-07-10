import UpcomingProject from '../models/UpcomingProject.js';

// Get all upcoming projects
export const getAllUpcomingProjects = async (req, res) => {
  try {
    const projects = await UpcomingProject.find()
      .select('title propertyType location description priceRangeMin priceRangeMax launchDate image registeredUsers totalUnits bedrooms')
      .sort({ launchDate: 1 });
    
    return res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching upcoming projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming projects'
    });
  }
};

// Get upcoming project by ID
export const getUpcomingProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await UpcomingProject.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error fetching upcoming project details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details'
    });
  }
};

// Register interest for a project
export const registerInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required'
      });
    }
    
    const project = await UpcomingProject.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user already registered with this email
    const isAlreadyRegistered = project.registrations.some(reg => reg.email === email);
    
    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered interest for this project'
      });
    }
    
    // Add new registration
    const newRegistration = {
      name,
      email,
      phone,
      message: message || '',
      registeredAt: new Date()
    };
    
    project.registrations.push(newRegistration);
    project.registeredUsers = project.registrations.length;
    
    await project.save();
    
    return res.status(200).json({
      success: true,
      message: 'Your interest has been registered successfully'
    });
  } catch (error) {
    console.error('Error registering interest:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register interest'
    });
  }
};