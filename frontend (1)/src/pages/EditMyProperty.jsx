import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  IndianRupee, 
  BedDouble, 
  Bath, 
  Maximize, 
  FileText, 
  Phone, 
  Trash2, 
  Plus, 
  Upload, 
  Loader,
  Save,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Backendurl } from '../App';
import { useAuth } from '../context/AuthContext';

const EditMyProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    type: '',
    description: '',
    phone: '',
    invest: '',
    amenities: [],
    images: [],
  });
  const [availability, setAvailability] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState(false);

  // Property types for dropdown
  const propertyTypes = ['House', 'Apartment', 'Villa', 'Farmhouse', 'Office', 'Shop', 'Plot/Land', 'Commercial Property'];
  
  // Common amenities for checkboxes
  const commonAmenities = [
    'Air Conditioning', 'Parking', 'Swimming Pool', 'Garden', 'Gym', 
    'Security', 'Elevator', 'Power Backup', 'Furnished', 'CCTV', 
    'Wi-Fi', 'Water Supply 24/7', 'Gated Community'
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // toast.error('Please login to edit property');
          console.error('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${Backendurl}/api/users/properties/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const propertyData = response.data.property;
          
          // Check if current user is the owner of the property
          if (propertyData.owner !== user?._id) {
            // toast.error('You can only edit your own properties');
            console.error('Unauthorized access, redirecting to My Properties');
            navigate('/my-properties');
            return;
          }

          setProperty(propertyData);
          
          // Populate form data
          setFormData({
            title: propertyData.title || '',
            location: propertyData.location || '',
            price: propertyData.price || '',
            beds: propertyData.beds || '',
            baths: propertyData.baths || '',
            sqft: propertyData.sqft || '',
            type: propertyData.type || '',
            description: propertyData.description || '',
            phone: propertyData.phone || '',
            invest: propertyData.invest || '',
            amenities: propertyData.amenities || [],
            images: [],
          });
          
          setAvailability(propertyData.availability || 'rent');
          setPropertyImages(propertyData.image || []);
        } else {
          // toast.error(response.data.message || 'Failed to fetch property');
          console.error('Failed to fetch property:', response.data.message);
          navigate('/my-properties');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        // toast.error('Error loading property data');
        console.error('Error loading property data:', error);
        navigate('/my-properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const currentAmenities = [...prev.amenities];
      if (currentAmenities.includes(amenity)) {
        return { ...prev, amenities: currentAmenities.filter(item => item !== amenity) };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenity] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = [];
    
    files.forEach(file => {
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...previewUrls];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // toast.error('Please login to update property');
        console.error('No token found, redirecting to login');
        return;
      }
      
      // Create FormData for file uploads
      const formDataObj = new FormData();
      formDataObj.append('id', id);
      formDataObj.append('title', formData.title);
      formDataObj.append('location', formData.location);
      formDataObj.append('price', formData.price);
      formDataObj.append('beds', formData.beds);
      formDataObj.append('baths', formData.baths);
      formDataObj.append('sqft', formData.sqft);
      formDataObj.append('type', formData.type);
      formDataObj.append('description', formData.description);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('invest', formData.invest || '');
      formDataObj.append('availability', availability);
      formDataObj.append('owner', user._id);
      
      // Append amenities as JSON string
      if (formData.amenities && formData.amenities.length > 0) {
        formDataObj.append('amenities', JSON.stringify(formData.amenities));
      }
      
      // Append images if any
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          formDataObj.append(`image${index + 1}`, image);
        });
      }
      
      // If deleteImages is true, this indicates we want to replace all images
      formDataObj.append('deleteImages', deleteImages);
      
      const response = await axios.put(
        `${Backendurl}/api/users/properties/update`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success('Property updated successfully');
        console.log('Property updated successfully');
        navigate('/my-properties');
      } else {
        // toast.error(response.data.message || 'Failed to update property');
        console.error('Failed to update property:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      // toast.error('An error occurred while updating the property');
      console.error('An error occurred while updating the property:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/my-properties');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading property data...</h3>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Building className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Property not found</h3>
            <button 
              onClick={handleGoBack}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go back to My Properties
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Edit Property</h1>
              </div>
              <button 
                onClick={handleGoBack} 
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Property Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Home size={20} />
                Property Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter property title"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter price"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contact number"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">Availability</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="rent"
                        checked={availability === "rent"}
                        onChange={() => setAvailability("rent")}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">For Rent</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="sell"
                        checked={availability === "sell"}
                        onChange={() => setAvailability("sell")}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">For Sale</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center gap-1">
                      <BedDouble size={18} />
                      Bedrooms
                    </div>
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bedrooms"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center gap-1">
                      <Bath size={18} />
                      Bathrooms
                    </div>
                  </label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bathrooms"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center gap-1">
                      <Maximize size={18} />
                      Square Feet
                    </div>
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Area in sq ft"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <div className="flex items-center gap-1">
                    <FileText size={18} />
                    Description
                  </div>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the property..."
                ></textarea>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Investment Details (Optional)</label>
                <input
                  type="text"
                  name="invest"
                  value={formData.invest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Monthly rental income or investment details"
                />
              </div>
            </div>
            
            {/* Amenities Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonAmenities.map((amenity) => (
                  <label key={amenity} className="inline-flex items-center bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Images Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Images</h2>
              
              {/* Existing images */}
              {propertyImages.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-700">Current Images</h3>
                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={deleteImages}
                          onChange={(e) => setDeleteImages(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-red-600 rounded"
                        />
                        <span className="ml-2 text-sm text-red-600">Replace all images</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {propertyImages.map((image, index) => (
                      <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New images */}
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Add New Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
                  </label>
                </div>
              </div>
              
              {/* Image previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">New Images Preview</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-4 py-2 mr-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Property
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditMyProperty;