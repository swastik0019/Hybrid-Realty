import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeTemplate } from "../email.js";
import { getPasswordResetTemplate } from "../email.js";
// import Property from "../models/propertymodel.js"; // Import your Property model
import verificationModel from "../models/verificationmodel.js";
const backendurl = process.env.BACKEND_URL;

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Registeruser = await userModel.findOne({ email });
    if (!Registeruser) {
      return res.json({ message: "Email not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, Registeruser.password);
    if (isMatch) {
      const token = createtoken(Registeruser._id);
      return res.json({ token, user: { name: Registeruser.name, email: Registeruser.email }, success: true });
    } else {
      return res.json({ message: "Invalid password", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", success: false });
  }
};

// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!validator.isEmail(email)) {
//       return res.json({ message: "Invalid email", success: false });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new userModel({ name, email, password: hashedPassword });
//     await newUser.save();
//     const token = createtoken(newUser._id);

//     // send email
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Welcome to Hybrid Realty - Your Account Has Been Created",
//       html: getWelcomeTemplate(name)
//     };

//     await transporter.sendMail(mailOptions);

//     return res.json({ token, user: { name: newUser.name, email: newUser.email }, success: true });
//   } catch (error) {
//     console.error(error);
//     return res.json({ message: "Server error", success: false });
//   }
// };

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Hybrid Realty Security",
      html: getPasswordResetTemplate(resetUrl)
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Add this to your user controller

const toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id; // Assumes you have an auth middleware that sets req.user

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if property is already in wishlist
    const propertyIndex = user.wishlist.indexOf(propertyId);
    
    if (propertyIndex > -1) {
      // Property is in wishlist, so remove it
      user.wishlist.splice(propertyIndex, 1);
      await user.save();
      return res.json({ 
        message: "Property removed from wishlist", 
        success: true, 
        isInWishlist: false 
      });
    } else {
      // Property is not in wishlist, so add it
      user.wishlist.push(propertyId);
      await user.save();
      return res.json({ 
        message: "Property added to wishlist", 
        success: true, 
        isInWishlist: true 
      });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return res.status(500).json({ 
      message: "Server error", 
      success: false 
    });
  }
};


const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if property is in wishlist
    const isFavorite = user.wishlist.includes(propertyId);

    return res.json({ 
      success: true, 
      isFavorite: isFavorite 
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return res.status(500).json({ 
      message: "Server error", 
      success: false 
    });
  }
};


const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.find({email});

    console.log('user : ',user[0].isAdmin);
    
    if (user[0].isAdmin) {
      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, success: true });
    } else {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
    try {
        return res.json({ message: "Logged out", success: true });
    } catch (error) {
        console.error(error);
        return res.json({ message: "Server error", success: false });
    }
};

// get name and email
const getname = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    return res.json(user);
  }
  catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
}

// New functions for admin panel

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access this resource" 
      });
    }

    const users = await userModel.find().select("-password");
    
    return res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin only)
 */
const getUserById = async (req, res) => {
  try {
    // Check if user is admin
    // if (req.user.email !== process.env.ADMIN_EMAIL) {
    //   return res.status(403).json({ 
    //     success: false, 
    //     message: "Not authorized to access this resource" 
    //   });
    // }

    const user = await userModel.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};















const getMyWishlist = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify the token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find user with populated wishlist
    const user = await userModel.findById(userId)
      .populate({
        path: 'wishlist',
        model: 'properties', // Make sure this matches your Property model name
        select: '_id serialNumber title location price image beds baths sqft type availability description'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return populated wishlist items
    return res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};


const removeMyWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Validate propertyId
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }
    
    // Get user from middleware
    const userId = req.user._id;
    
    // Update user by pulling the property from wishlist array
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: propertyId } },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ 
      message: 'Property removed from wishlist',
      wishlist: updatedUser.wishlist
    });
    
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};










/**
 * @desc    Get properties in user's wishlist
 * @route   GET /api/users/:id/wishlist
 * @access  Private (Admin only)
 */
const getUserWishlist = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access this resource" 
      });
    }

    const user = await userModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (!user.wishlist || user.wishlist.length === 0) {
      return res.json([]);
    }
    
    // Adjust this query based on your property model name and collection
    const properties = await properties.find({
      _id: { $in: user.wishlist }
    });
    
    return res.json(properties);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/**
 * @desc    Remove property from user's wishlist
 * @route   DELETE /api/users/:id/wishlist/:propertyId
 * @access  Private (Admin only)
 */
const removeFromWishlist = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access this resource" 
      });
    }

    const user = await userModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Remove property from wishlist
    const propertyIndex = user.wishlist.indexOf(req.params.propertyId);
    
    if (propertyIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Property not in wishlist"
      });
    }
    
    user.wishlist.splice(propertyIndex, 1);
    await user.save();
    
    return res.json({
      success: true,
      message: "Property removed from wishlist"
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access this resource" 
      });
    }

    const user = await userModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    await userModel.findByIdAndRemove(req.params.id);
    
    return res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};




import { getVerificationOTPTemplate } from "../email.js";


const sendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email", success: false });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already registered", success: false });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

    // Save verification data
    const verificationId = crypto.randomBytes(16).toString("hex");
    
    // Delete any existing verification records for this email
    await verificationModel.deleteMany({ email });
    
    // Create new verification record
    const verification = new verificationModel({
      email,
      otp: await bcrypt.hash(otp, 10), // Store hashed OTP for security
      verificationId,
      expiresAt: otpExpiry
    });
    
    await verification.save();

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Hybrid Realty - Email Verification Code",
      html: getVerificationOTPTemplate(otp) // You need to create this template
    };

    await transporter.sendMail(mailOptions);

    return res.json({ 
      message: "Verification code sent", 
      success: true,
      verificationId 
    });
  } catch (error) {
    console.error("Error sending verification:", error);
    return res.status(500).json({ 
      message: "Server error", 
      success: false 
    });
  }
};

// New function to verify OTP and register user
const verifyOTP = async (req, res) => {
  try {
    const { verificationId, otp, userData } = req.body;
    
    // Find verification record
    const verification = await verificationModel.findOne({ 
      verificationId,
      expiresAt: { $gt: new Date() } // Check if OTP is still valid
    });
    
    if (!verification) {
      return res.json({ 
        message: "Verification code expired or invalid", 
        success: false 
      });
    }
    
    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, verification.otp);
    
    if (!isValidOTP) {
      return res.json({ 
        message: "Invalid verification code", 
        success: false 
      });
    }
    
    // OTP is valid, create the user
    const { name, email, password } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ 
      name, 
      email, 
      password: hashedPassword,
      isEmailVerified: true 
    });
    
    await newUser.save();
    
    // Delete verification record
    await verificationModel.deleteOne({ _id: verification._id });
    
    // Create authentication token
    const token = createtoken(newUser._id);
    
    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Hybrid Realty - Your Account Has Been Created",
      html: getWelcomeTemplate(name)
    };

    await transporter.sendMail(mailOptions);

    return res.json({ 
      token, 
      user: { name: newUser.name, email: newUser.email }, 
      success: true 
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ 
      message: "Server error", 
      success: false 
    });
  }
};

// Modify existing register function to handle only admin registration if needed
const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    
    // Only allow direct registration without OTP if admin flag is provided
    // And request comes from an admin (you should add middleware to check this)
    if (!isAdmin) {
      return res.json({ 
        message: "Email verification required", 
        success: false 
      });
    }
    
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email", success: false });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ 
      name, 
      email, 
      password: hashedPassword,
      isEmailVerified: true 
    });
    
    await newUser.save();
    const token = createtoken(newUser._id);

    // send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Hybrid Realty - Your Account Has Been Created",
      html: getWelcomeTemplate(name)
    };

    await transporter.sendMail(mailOptions);

    return res.json({ 
      token, 
      user: { name: newUser.name, email: newUser.email }, 
      success: true 
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};








// In your controller file (e.g., propertyController.js)

import Property from '../models/propertymodel.js'; // Adjust path as needed

// Function to get user's properties
const getProperties = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Find all properties where the owner matches the user ID
    const properties = await Property.find({ owner: userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    return res.status(200).json({
      success: true,
      properties,
      count: properties.length
    });
  } catch (error) {
    console.error("Error fetching user properties:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while fetching your properties" 
    });
  }
};

// Function to delete a property
const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id;
    
    // Find the property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    // Check if user is the owner
    if (property.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property"
      });
    }
    
    // Delete the property
    await Property.findByIdAndDelete(propertyId);
    
    return res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting property"
    });
  }
};


export { 
  login, 
  register, 
  forgotpassword, 
  resetpassword, 
  adminlogin, 
  logout, 
  getname, 
  toggleWishlist, 
  checkFavorite,
  getAllUsers,
  getUserById,
  getUserWishlist,
  removeFromWishlist,
  deleteUser,
  sendVerification,  // New export
  verifyOTP,
  getProperties,
  deleteProperty,
  getMyWishlist,
  removeMyWishlist,
};