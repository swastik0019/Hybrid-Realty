import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import LuckyDrawProperty from "../models/LuckyDrawProperty.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";

// Keep existing lucky draw creation endpoint for backward compatibility
const createLuckyDraw = async (req, res) => {
  try {
    const { propertyId, biddingStartDate, biddingEndDate } = req.body;
    
    // Validate inputs
    if (!propertyId || !biddingStartDate || !biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if property is already in a lucky draw
    const existingLuckyDraw = await LuckyDrawProperty.findOne({
      property: propertyId,
      status: { $in: ['active', 'upcoming'] }
    });
    
    if (existingLuckyDraw) {
      return res.status(400).json({
        success: false,
        message: 'Property is already in an active lucky draw'
      });
    }
    
    // Create a new lucky draw property
    const newLuckyDrawProperty = new LuckyDrawProperty({
      property: propertyId,
      biddingStartDate,
      biddingEndDate
    });
    
    await newLuckyDrawProperty.save();
    
    res.json({
      success: true,
      message: 'Lucky draw property created successfully',
      luckyDrawProperty: {
        _id: newLuckyDrawProperty._id,
        property: {
          _id: property._id,
          title: property.title,
          location: property.location
        },
        biddingStartDate: newLuckyDrawProperty.biddingStartDate,
        biddingEndDate: newLuckyDrawProperty.biddingEndDate
      }
    });
  } catch (error) {
    console.error('Error creating lucky draw property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// New endpoint to create property and add to lucky draw in one step
const createPropertyWithLuckyDraw = async (req, res) => {
  try {
    // Extract property details from request body
    const { 
      title, 
      location, 
      price, 
      beds, 
      baths, 
      sqft, 
      type, 
      availability, 
      description, 
      amenities, 
      phone, 
      invest,
      isForInvestment,
      biddingStartDate, 
      biddingEndDate 
    } = req.body;
    
    // Validate required fields for property
    if (!title || !location || !price || !beds || !baths || !sqft || !type || !description || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All property fields are required'
      });
    }
    
    // Validate lucky draw dates
    if (!biddingStartDate || !biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Bidding start and end dates are required'
      });
    }
    
    // Ensure end date is after start date
    const startDate = new Date(biddingStartDate);
    const endDate = new Date(biddingEndDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Bidding end date must be after start date'
      });
    }
    
    // Extract and process images
    const image1 = req.files.image1 || null;
    const image2 = req.files.image2 || null;
    const image3 = req.files.image3 || null;
    const image4 = req.files.image4 || null;
    const image5 = req.files.image5 || null;
    const image6 = req.files.image6 || null;
    const image7 = req.files.image7 || null;
    const image8 = req.files.image8 || null;
    const image9 = req.files.image9 || null;
    const image10 = req.files.image10 || null;
    const image11 = req.files.image11 || null;
    const image12 = req.files.image12 || null;
    const image13 = req.files.image13 || null;
    const image14 = req.files.image14 || null;
    const image15 = req.files.image15 || null;
    
    const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15].filter(item => item !== null);
    // Debug information
    console.log("Number of images:", images.length);
    images.forEach((img, idx) => {
      console.log(`Image ${idx + 1}:`, img?.name, img?.mimetype, img?.size);
    });
    
    // If no images were provided, return error
    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one property image is required'
      });
    }
    
    // Upload images to Cloudinary
    const imageUrls = [];
    
    for (const file of images) {
      try {
        console.log(`Uploading ${file.name} (${file.size} bytes) to Cloudinary`);
        
        // Use the uploadImageToCloudinary utility function
        const result = await uploadImageToCloudinary(file, "property-uploads");
        
        console.log("Cloudinary upload success for:", file.name, "URL:", result.secure_url);
        imageUrls.push(result.secure_url);
        
        // Delete the temp file if needed
        if (file.tempFilePath) {
          fs.unlink(file.tempFilePath, (err) => {
            if (err) console.log("Error deleting the temp file: ", err);
          });
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        // Continue with other images even if one fails
      }
    }
    
    // If no images were successfully uploaded, return error
    if (imageUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload property images'
      });
    }
    
    // Parse amenities if needed
    let parsedAmenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        console.log("Error parsing amenities, treating as string:", e);
        parsedAmenities = amenities ? [amenities] : [];
      }
    } else {
      parsedAmenities = Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []);
    }
    
    // Create a new property with auto-approval
    const property = new Property({
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability: availability || 'sell',
      description,
      amenities: parsedAmenities,
      image: imageUrls,
      phone,
      invest: invest || 0,
      isForInvestment: isForInvestment === 'true' || isForInvestment === true,
      isApproved: true, // Auto-approve for lucky draw
      lp: true,
    });
    
    // Save the property
    await property.save();
    
    // Create a new lucky draw property
    const newLuckyDrawProperty = new LuckyDrawProperty({
      property: property._id,
      biddingStartDate,
      biddingEndDate
    });
    
    // Save the lucky draw property
    await newLuckyDrawProperty.save();
    
    // Return success response
    res.json({
      success: true,
      message: 'Property created and added to lucky draw successfully',
      luckyDrawProperty: {
        _id: newLuckyDrawProperty._id,
        property: {
          _id: property._id,
          title: property.title,
          location: property.location
        },
        biddingStartDate: newLuckyDrawProperty.biddingStartDate,
        biddingEndDate: newLuckyDrawProperty.biddingEndDate
      }
    });
  } catch (error) {
    console.error('Error creating property with lucky draw:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export { createLuckyDraw, createPropertyWithLuckyDraw };