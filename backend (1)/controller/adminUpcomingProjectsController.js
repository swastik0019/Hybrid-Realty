import UpcomingProject from '../models/UpcomingProject.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parser } from 'json2csv';
import uploadImageToCloudinary from '../utils/imageUploader.js';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all upcoming projects (admin)
export const getAllUpcomingProjects = async (req, res) => {
  try {
    const projects = await UpcomingProject.find()
      .select('title propertyType location image priceRangeMin priceRangeMax launchDate totalUnits registeredUsers');
    
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

// Get upcoming project by ID (admin)
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

// Create a new upcoming project
export const createUpcomingProject = async (req, res) => {
  try {
    const {
      title,
      propertyType,
      location,
      description,
      priceRangeMin,
      priceRangeMax,
      launchDate,
      completionDate,
      totalUnits,
      bedrooms,
      specifications,
      developerInfo,
      contactPhone,
      amenities
    } = req.body;
    
    // console.log(req.body);
    // Check for required fields
    if (!title || !propertyType || !location || !description || !priceRangeMin 
        || !priceRangeMax || !launchDate || !totalUnits || !bedrooms || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Process uploaded images
    let imageUrls = [];
    
    if (req.files && Object.keys(req.files).length > 0) {
      const fileKeys = Object.keys(req.files);
      
      for (const key of fileKeys) {
        const file = req.files[key];
        
        // Check if file is valid
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({
            success: false,
            message: `File ${key} is not a valid image`
          });
        }
        
        try {
          // console.log(`Uploading ${file.name} (${file.size} bytes) to Cloudinary`);
          
          // Use the uploadImageToCloudinary utility function
          const result = await uploadImageToCloudinary(file, "upcoming-projects");
          
          // console.log("Cloudinary upload success for:", file.name, "URL:", result.secure_url);
          imageUrls.push(result.secure_url);
          
          // Delete the temp file if needed
          if (file.tempFilePath) {
            fs.unlink(file.tempFilePath, (err) => {
              if (err) console.log("Error deleting the temp file: ", err);
            });
          }
        } catch (error) {
          console.error('Error uploading file to Cloudinary:', error);
          continue; // Continue with other files even if one fails
        }
      }
    }
    
    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one project image'
      });
    }
    
    // Parse amenities if it's a string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        console.log("Error parsing amenities:", e);
        parsedAmenities = amenities ? [amenities] : [];
      }
    }
    
    // Create new project
    const newProject = new UpcomingProject({
      title,
      propertyType,
      location,
      description,
      priceRangeMin,
      priceRangeMax,
      launchDate,
      totalUnits,
      bedrooms,
      contactPhone,
      image: imageUrls,
      amenities: parsedAmenities || []
    });
    
    // Add optional fields if provided
    if (completionDate) newProject.completionDate = completionDate;
    if (specifications) newProject.specifications = specifications;
    if (developerInfo) newProject.developerInfo = developerInfo;
    
    await newProject.save();
    
    return res.status(201).json({
      success: true,
      message: 'Upcoming project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error creating upcoming project:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create upcoming project: ' + error.message
    });
  }
};

/**
 * Update an existing upcoming project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUpcomingProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      propertyType,
      location,
      description,
      priceRangeMin,
      priceRangeMax,
      launchDate,
      completionDate,
      totalUnits,
      bedrooms,
      specifications,
      developerInfo,
      contactPhone,
      amenities
    } = req.body;
    
    const project = await UpcomingProject.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Update fields if provided
    if (title) project.title = title;
    if (propertyType) project.propertyType = propertyType;
    if (location) project.location = location;
    if (description) project.description = description;
    if (priceRangeMin) project.priceRangeMin = priceRangeMin;
    if (priceRangeMax) project.priceRangeMax = priceRangeMax;
    if (launchDate) project.launchDate = launchDate;
    if (completionDate) project.completionDate = completionDate;
    if (totalUnits) project.totalUnits = totalUnits;
    if (bedrooms) project.bedrooms = bedrooms;
    if (specifications) project.specifications = specifications;
    if (developerInfo) project.developerInfo = developerInfo;
    if (contactPhone) project.contactPhone = contactPhone;
    
    // Parse amenities if it's a string
    if (amenities) {
      let parsedAmenities = amenities;
      if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch (e) {
          console.log("Error parsing amenities:", e);
          parsedAmenities = amenities ? [amenities] : [];
        }
      }
      project.amenities = parsedAmenities;
    }
    
    // Process new images if uploaded
    if (req.files && Object.keys(req.files).length > 0) {
      const fileKeys = Object.keys(req.files);
      let newImageUrls = [];
      
      for (const key of fileKeys) {
        const file = req.files[key];
        
        // Check if file is valid
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({
            success: false,
            message: `File ${key} is not a valid image`
          });
        }
        
        try {
          console.log(`Uploading update image ${file.name} (${file.size} bytes) to Cloudinary`);
          
          // Use the uploadImageToCloudinary utility function
          const result = await uploadImageToCloudinary(file, "upcoming-projects");
          
          console.log("Cloudinary upload success for update:", file.name, "URL:", result.secure_url);
          newImageUrls.push(result.secure_url);
          
          // Delete the temp file if needed
          if (file.tempFilePath) {
            fs.unlink(file.tempFilePath, (err) => {
              if (err) console.log("Error deleting the temp file: ", err);
            });
          }
        } catch (error) {
          console.error('Error uploading file to Cloudinary:', error);
          continue; // Continue with other files even if one fails
        }
      }
      
      if (newImageUrls.length > 0) {
        // Replace old images with new ones
        project.image = newImageUrls;
      }
    }
    
    await project.save();
    
    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating upcoming project:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project: ' + error.message
    });
  }
};

// Delete an upcoming project
export const deleteUpcomingProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await UpcomingProject.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete project images from filesystem
    for (const image of project.image) {
      try {
        const imagePath = path.join(__dirname, '../public', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting project image:', err);
      }
    }
    
    await UpcomingProject.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting upcoming project:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
};

// Export project registrations as CSV
export const exportRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await UpcomingProject.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    if (!project.registrations || project.registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registrations found for this project'
      });
    }
    
    // Prepare data for CSV export
    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Message', value: 'message' },
      { label: 'Registered At', value: 'registeredAt' }
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(project.registrations);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="project-registrations-${id}.csv"`);
    
    return res.status(200).send(csv);
    
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export registrations'
    });
  }
};