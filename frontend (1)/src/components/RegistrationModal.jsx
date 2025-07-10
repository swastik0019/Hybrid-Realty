import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, Gift, Users, Check, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Backendurl } from '../../App.jsx';
import { toast } from 'react-toastify';

const RegistrationModal = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      // toast.error('Please enter your name');
      console.error('Please enter your name');
      return false;
    }
    
    if (!formData.phone.trim()) {
      // toast.error('Please enter your phone number');
      console.error('Please enter your phone number');
      return false;
    }
    
    // Basic phone validation
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      // toast.error('Please enter a valid 10-digit phone number');
      console.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    if (!formData.email.trim()) {
      // toast.error('Please enter your email');
      console.error('Please enter your email');
      return false;
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      // toast.error('Please enter a valid email address');
      console.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const checkRegistrationStatus = async () => {
    if (!formData.phone.trim()) {
      // toast.error('Please enter your phone number to check');
      console.error('Please enter your phone number to check');
      return;
    }
    
    try {
      setIsChecking(true);
      setError(null);
      
      const response = await axios.post(
        `${Backendurl}/api/lucky-draw/${property._id}/check-registration`,
        { phone: formData.phone }
      );
      
      if (response.data.success) {
        if (response.data.isRegistered) {
          // toast.info('You are already registered for this lucky draw!');
          console.log('You are already registered for this lucky draw!');
          setRegistered(true);
        } else {
          // toast.info('You are not registered yet. Please complete the form to register.');
          console.log('You are not registered yet. Please complete the form to register.');
        }
      }
    } catch (err) {
      console.error('Error checking registration status:', err);
      // toast.error('Failed to check registration status. Please try again.');
      console.error('Failed to check registration status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${Backendurl}/api/lucky-draw/${property._id}/register`,
        formData
      );
      
      if (response.data.success) {
        // toast.success('Successfully registered for the lucky draw!');
        console.log('Successfully registered for the lucky draw!');
        setRegistered(true);
        
        // Notify parent component about successful registration
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.data.message || 'Failed to register. Please try again.');
      }
    } catch (err) {
      console.error('Error registering for lucky draw:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[var(--theme-color-3)]" />
            Lucky Draw Registration
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Property Details */}
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">{property.title}</h3>
          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-[var(--theme-color-1)]" />
              <span>{property.registrationCount || 0} registered</span>
            </div>
            <div>
              Draw Date: {new Date(property.startDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {registered ? (
          // Registration Success View
          <div className="p-5">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                You have successfully registered for the lucky draw. We will notify you if you win!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          // Registration Form
          <form onSubmit={handleSubmit} className="p-5">
            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-color-1)] focus:border-[var(--theme-color-1)] transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-color-1)] focus:border-[var(--theme-color-1)] transition-colors"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
                <button
                  type="button"
                  onClick={checkRegistrationStatus}
                  disabled={isChecking}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  {isChecking ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Check</span>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter your 10-digit mobile number</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-color-1)] focus:border-[var(--theme-color-1)] transition-colors"
                placeholder="Your email address"
                required
              />
            </div>
            
            <div className="text-sm text-gray-600 mb-6">
              <p className="mb-2">By registering, you agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be contacted if you win the lucky draw</li>
                <li>Receive property updates and offers from Hybrid Realty</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[var(--theme-color-3)] text-white rounded-lg hover:bg-[var(--theme-hover-color-3)] transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Register Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

RegistrationModal.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    registrationCount: PropTypes.number
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default RegistrationModal;