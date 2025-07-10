import express from 'express';
import {
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
  // New routes
  sendVerification,
  verifyOTP,
  getProperties,
  getMyWishlist,
  removeMyWishlist,
} from '../controller/Usercontroller.js';
import authMiddleware, { protect } from '../middleware/authmiddleware.js';
import { getPropertyById, updateproperty } from '../controller/productcontroller.js';

const userrouter = express.Router();

// New verification routes
userrouter.post('/send-verification', sendVerification);
userrouter.post('/verify-otp', verifyOTP);

// Existing routes
userrouter.post('/login', login);
userrouter.post('/register', register);
userrouter.post('/forgot', forgotpassword);
userrouter.post('/reset/:token', resetpassword);
userrouter.post('/admin', adminlogin);
userrouter.get('/me', protect, getname);
userrouter.post('/toggle-wishlist', protect, toggleWishlist);
userrouter.get('/check-favorite/:propertyId', protect, checkFavorite);
userrouter.get('/me/properties', protect, getProperties);
userrouter.get('/me/wishlist', protect, getMyWishlist);
userrouter.delete('/me/wishlist/:propertyId', protect, removeMyWishlist);

// Admin routes
userrouter.get('/', authMiddleware, getAllUsers);
userrouter.get('/:id', getUserById);
userrouter.get('/:id/wishlist', authMiddleware, getUserWishlist);
userrouter.delete('/:id/wishlist/:propertyId', authMiddleware, removeFromWishlist);
userrouter.delete('/:id', authMiddleware, deleteUser);



userrouter.put('/properties/update', protect, updateproperty);

// Route to get a property by ID
userrouter.get('/properties/:id', protect, getPropertyById);




export default userrouter;