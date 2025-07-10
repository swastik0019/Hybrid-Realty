import express from 'express';
import { addproperty, listproperty, removeproperty, updateproperty,singleproperty } from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const propertyrouter = express.Router();

propertyrouter.post('/add', protect, async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Image could not be uploaded'
        });
      }
      
      // Validate required fields
      const requiredFields = ['title', 'type', 'price', 'location', 'description', 'beds', 'baths', 'sqft', 'phone', 'availability'];
      
      for (let field of requiredFields) {
        if (!fields[field] || !fields[field][0]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }
      
      // Check if there are image files
      const imageFiles = Object.keys(files).filter(key => key.startsWith('image'));
      
      if (imageFiles.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one image is required'
        });
      }
      
      // Upload images to Cloudinary
      const imageUrls = [];
      for (let key of imageFiles) {
        const file = files[key][0];
        const result = await uploadToCloudinary(file.filepath);
        imageUrls.push(result.url);
        
        // Remove temp file
        fs.unlink(file.filepath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
      
      // Parse amenities if provided
      let amenities = [];
      if (fields.amenities && fields.amenities[0]) {
        try {
          amenities = JSON.parse(fields.amenities[0]);
        } catch (error) {
          console.error('Error parsing amenities:', error);
        }
      }
      
      // Create property object
      const propertyData = {
        title: fields.title[0],
        type: fields.type[0],
        price: Number(fields.price[0]),
        location: fields.location[0],
        description: fields.description[0],
        beds: Number(fields.beds[0]),
        baths: Number(fields.baths[0]),
        sqft: Number(fields.sqft[0]),
        phone: fields.phone[0],
        amenities: amenities,
        availability: fields.availability[0],
        image: imageUrls,
        user: req.user._id,
        isForInvestment: fields.isForInvestment && fields.isForInvestment[0] === 'true'
      };
      
      // Add invest field if applicable
      if (fields.invest && fields.invest[0]) {
        propertyData.invest = fields.invest[0];
      }
      
      // Save property to database
      const property = new Property(propertyData);
      const savedProperty = await property.save();
      
      res.status(201).json({
        success: true,
        message: 'Property added successfully',
        property: savedProperty
      });
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


propertyrouter.get('/list', listproperty);
propertyrouter.post('/remove',auth, removeproperty);
propertyrouter.post('/update',auth, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), updateproperty);
propertyrouter.get('/single/:id', singleproperty);

export default propertyrouter;