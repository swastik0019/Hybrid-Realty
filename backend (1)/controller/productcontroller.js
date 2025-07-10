import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import LuckyDrawProperty from "../models/LuckyDrawProperty.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";

const addproperty = async (req, res) => {
   
    try {
      const { 
        title, location, price, beds, baths, sqft, 
        type, availability, description, phone, invest, owner , isHotDeal
      } = req.body;
      
      // Parse amenities if it's a string
      let amenities = req.body.amenities;
      if (typeof amenities === 'string') {
        try {
          amenities = JSON.parse(amenities);
        } catch (e) {
          console.log("Error parsing amenities:", e);
        }
      }
      
      // Debug log the request files
      console.log("Request files:", req.files ? Object.keys(req.files) : "No files");
      
      // Check if files exist in the request
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 
          message: "No files were uploaded", 
          success: false 
        });
      }
      
      // Get image files from req.files
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
      
      // If no images were provided, still proceed but with empty image array
      const imageUrls = [];
      
      // Only try to upload images if there are any
      if (images.length > 0) {
        // Upload images to Cloudinary
        for (const file of images) {
          try {
            console.log(`Uploading ${file.name} (${file.size} bytes) to Cloudinary`);
            
            // Use the uploadImageToCloudinary utility function
            const result = await uploadImageToCloudinary(file, "property-uploads");
            
            console.log("Cloudinary upload success for:", file.name, "URL:", result.secure_url);
            imageUrls.push(result.secure_url);
          } catch (err) {
            console.error("Cloudinary upload error:", err);
            // Continue with other images even if one fails
          }
        }
      }
      
      // Create a new property
      const property = new Property({
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
        image: imageUrls,
        phone,
        invest,
        owner,
        isHotDeal,
      });
      
      // Save the property to the database
      await property.save();
      
      res.json({ 
        message: "Property added successfully", 
        success: true,
        property: {
          id: property._id,
          title: property.title,
          imageCount: imageUrls.length
        }
      });
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ 
        message: "Server Error: " + error.message, 
        success: false 
      });
    }
  };

const listproperty = async (req, res) => {
    try {
        const property = await Property.find();
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
      const { id } = req.body;
  
      // Delete the Property document
      const property = await Property.findByIdAndDelete(id);
  
      // Delete the LuckyDrawProperty where property field matches the Property ID
      const luckydrawproperty = await LuckyDrawProperty.findOneAndDelete({ property: id });
  
      if (!property && !luckydrawproperty) {
        return res.status(404).json({ message: "No matching records found", success: false });
      }
  
      return res.json({ message: "Property and lucky draw entry removed successfully", success: true });
    } catch (error) {
      console.error("Error removing property:", error);
      return res.status(500).json({ message: "Server Error", success: false });
    }
  };
  
  // const updateproperty = async (req, res) => {
  //   try {
  //     const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, invest, owner } = req.body;
  
  //     const property = await Property.findById(id);
  //     if (!property) {
  //       console.log("Property not found with ID:", id);
  //       return res.status(404).json({ message: "Property not found", success: false });
  //     }
  
  //     // Parse amenities if it's a string
  //     let parsedAmenities = amenities;
  //     if (typeof amenities === 'string') {
  //       try {
  //         parsedAmenities = JSON.parse(amenities);
  //       } catch (e) {
  //         console.log("Error parsing amenities:", e);
  //       }
  //     }
  
  //     if (!req.files || Object.keys(req.files).length === 0) {
  //       // No new images provided, just update the text fields
  //       property.title = title;
  //       property.location = location;
  //       property.price = price;
  //       property.beds = beds;
  //       property.baths = baths;
  //       property.sqft = sqft;
  //       property.type = type;
  //       property.availability = availability;
  //       property.description = description;
  //       property.amenities = parsedAmenities;
  //       property.phone = phone;
  //       property.invest = invest;
  //       property.owner = owner;
        
  //       // Keep existing images
  //       await property.save();
  //       return res.json({ 
  //         message: "Property updated successfully", 
  //         success: true 
  //       });
  //     }
  
  //     // Get image files from req.files
  //     // const image1 = req.files.image1 || null;
  //     // const image2 = req.files.image2 || null;
  //     // const image3 = req.files.image3 || null;
  //     // const image4 = req.files.image4 || null;
      
  //     // const images = [image1, image2, image3, image4].filter(item => item !== null);
      



  //     const image1 = req.files.image1 || null;
  //     const image2 = req.files.image2 || null;
  //     const image3 = req.files.image3 || null;
  //     const image4 = req.files.image4 || null;
  //     const image5 = req.files.image5 || null;
  //     const image6 = req.files.image6 || null;
  //     const image7 = req.files.image7 || null;
  //     const image8 = req.files.image8 || null;
  //     const image9 = req.files.image9 || null;
  //     const image10 = req.files.image10 || null;
  //     const image11 = req.files.image11 || null;
  //     const image12 = req.files.image12 || null;
  //     const image13 = req.files.image13 || null;
  //     const image14 = req.files.image14 || null;
  //     const image15 = req.files.image15 || null;
      
  //     const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15].filter(item => item !== null);




  //     // Debug information
  //     console.log("Number of images for update:", images.length);
  //     images.forEach((img, idx) => {
  //       console.log(`Update Image ${idx + 1}:`, img?.name, img?.mimetype, img?.size);
  //     });
      
  //     // Upload new images to Cloudinary
  //     const imageUrls = [];
      
  //     for (const file of images) {
  //       try {
  //         console.log(`Uploading update image ${file.name} (${file.size} bytes) to Cloudinary`);
          
  //         // Use the uploadImageToCloudinary utility function
  //         const result = await uploadImageToCloudinary(file, "property-uploads");
          
  //         console.log("Cloudinary upload success for update:", file.name, "URL:", result.secure_url);
  //         imageUrls.push(result.secure_url);
  //       } catch (err) {
  //         console.error("Cloudinary upload error for update:", err);
  //         // Continue with other images even if one fails
  //       }
  //     }
  
  //     // Update property fields
  //     property.title = title;
  //     property.location = location;
  //     property.price = price;
  //     property.beds = beds;
  //     property.baths = baths;
  //     property.sqft = sqft;
  //     property.type = type;
  //     property.availability = availability;
  //     property.description = description;
  //     property.amenities = parsedAmenities;
  //     property.phone = phone;
  //     property.invest = invest;
  //     property.owner = owner;
      
  //     // Update images if new ones were uploaded
  //     if (imageUrls.length > 0) {
  //       property.image = imageUrls;
  //     }
  
  //     await property.save();
  //     res.json({ 
  //       message: "Property updated successfully", 
  //       success: true,
  //       property: {
  //         id: property._id,
  //         title: property.title,
  //         imageCount: property.image.length
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error updating property:", error);
  //     res.status(500).json({ 
  //       message: "Server Error: " + error.message, 
  //       success: false 
  //     });
  //   }
  // };








  const getPropertyById = async (req, res) => {
    try {
      const propertyId = req.params.id;
      
      const property = await Property.findById(propertyId);
      
      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        property
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching property"
      });
    }
  };


// Complete updateProperty controller with authentication

const updateproperty = async (req, res) => {
  try {
    const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, invest } = req.body;
    const currentUserId = req.user._id; // Get the current authenticated user's ID
    
    // Find the property
    const property = await Property.findById(id);
    if (!property) {
      console.log("Property not found with ID:", id);
      return res.status(404).json({ message: "Property not found", success: false });
    }
    
    // Check if the current user is the owner of the property
    if (property.owner.toString() !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: "Unauthorized: You can only update your own properties", 
        success: false 
      });
    }

    // Parse amenities if it's a string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        console.log("Error parsing amenities:", e);
      }
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      // No new images provided, just update the text fields
      property.title = title;
      property.location = location;
      property.price = price;
      property.beds = beds;
      property.baths = baths;
      property.sqft = sqft;
      property.type = type;
      property.availability = availability;
      property.description = description;
      property.amenities = parsedAmenities;
      property.phone = phone;
      property.invest = invest;
      property.owner = currentUserId; // Ensure owner is current user
      
      // Keep existing images
      await property.save();
      return res.json({ 
        message: "Property updated successfully", 
        success: true 
      });
    }

    // Get image files from req.files
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
    console.log("Number of images for update:", images.length);
    images.forEach((img, idx) => {
      console.log(`Update Image ${idx + 1}:`, img?.name, img?.mimetype, img?.size);
    });
    
    // Upload new images to Cloudinary
    const imageUrls = [];
    
    for (const file of images) {
      try {
        console.log(`Uploading update image ${file.name} (${file.size} bytes) to Cloudinary`);
        
        // Use the uploadImageToCloudinary utility function
        const result = await uploadImageToCloudinary(file, "property-uploads");
        
        console.log("Cloudinary upload success for update:", file.name, "URL:", result.secure_url);
        imageUrls.push(result.secure_url);
      } catch (err) {
        console.error("Cloudinary upload error for update:", err);
        // Continue with other images even if one fails
      }
    }

    // Update property fields
    property.title = title;
    property.location = location;
    property.price = price;
    property.beds = beds;
    property.baths = baths;
    property.sqft = sqft;
    property.type = type;
    property.availability = availability;
    property.description = description;
    property.amenities = parsedAmenities;
    property.phone = phone;
    property.invest = invest;
    property.owner = currentUserId; // Ensure owner is current user
    
    // Check if there was a request to delete existing images
    const deleteImages = req.body.deleteImages === 'true';
    
    // Update images if new ones were uploaded
    if (imageUrls.length > 0) {
      if (deleteImages) {
        property.image = imageUrls; // Replace all images
      } else {
        property.image = [...property.image, ...imageUrls]; // Add to existing images
      }
    }

    await property.save();
    res.json({ 
      message: "Property updated successfully", 
      success: true,
      property: {
        id: property._id,
        title: property.title,
        imageCount: property.image.length
      }
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ 
      message: "Server Error: " + error.message, 
      success: false 
    });
  }
};





  


const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty, getPropertyById};