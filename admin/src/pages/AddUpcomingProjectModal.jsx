import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { compressImage } from "../utils/imageCompression";
import { 
  Building, 
  Upload, 
  X, 
  Loader,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Square,
  Phone,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";

const PROPERTY_TYPES = ['Residential Apartments', 'Luxury Villas', 'Independent Houses', 'Commercial Spaces', 'Office Buildings', 'Retail Shops', 'Plots/Land', 'Industrial Properties', 'Mixed-Use Development'];
const AMENITIES = ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden', 'Children Play Area', 'Security System', 'Parking', 'Lift', 'Power Backup', 'Community Hall', 'Sports Facilities', 'Jogging Track', 'Temple', 'Smart Home Features', 'EV Charging'];

const AddUpcomingProjectModal = ({ showModal, setShowModal, onSuccess }) => {
  // Add this to your form component state initialization
const [formData, setFormData] = useState({
  title: '',
  propertyType: '',
  location: '',
  description: '',
  priceRangeMin: '',
  priceRangeMax: '',
  launchDate: '',
  completionDate: '',
  totalUnits: '',
  bedrooms: '',
  specifications: '',
  developerInfo: '',
  contactPhone: '',
  amenities: []
});
  
  const [previewUrls, setPreviewUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processAndAddImages(files);
  };
  
  const processAndAddImages = async (files) => {
    if (files.length + previewUrls.length > 15) {
      toast.error(`Maximum ${15} images allowed`);
      console.error(`Maximum ${15} images allowed`);
      return;
    }
  
    // Show compression loading state
    setLoading(true); // or create a separate state like setIsCompressing(true)
    
    try {
      // Compress each image before adding it
      const compressedFiles = [];
      const newPreviewUrls = [];
      
      for (const file of files) {
        try {
          // Compress to max 2MB per image with max width/height of 1920px
          const compressedFile = await compressImage(file, 2, 1920, 0.7);
          compressedFiles.push(compressedFile);
          newPreviewUrls.push(URL.createObjectURL(compressedFile));
          
          console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (error) {
          console.error(`Error compressing image ${file.name}:`, error);
          // Use the original file as fallback if compression fails
          compressedFiles.push(file);
          newPreviewUrls.push(URL.createObjectURL(file));
        }
      }
      
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      setImages ? setImages((prev) => [...prev, ...compressedFiles]) : 
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...compressedFiles] }));
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images. Please try again.");
    } finally {
      setLoading(false); // or setIsCompressing(false)
    }
  };
  
  const addImages = (files) => {
    if (files.length + previewUrls.length > 15) {
      // toast.error('Maximum 15 images allowed');
      console.error('Maximum 15 images allowed');
      return;
    }
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setImages(prev => [...prev, ...files]);
  };
  
  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up to prevent memory leaks
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(Array.from(e.dataTransfer.files));
    }
  };
  
  // Add to form data when toggling amenities
const toggleAmenity = (amenity) => {
  setSelectedAmenities(prev => {
    if (prev.includes(amenity)) {
      const filtered = prev.filter(a => a !== amenity);
      setFormData(current => ({ ...current, amenities: filtered }));
      return filtered;
    } else {
      const updated = [...prev, amenity];
      setFormData(current => ({ ...current, amenities: updated }));
      return updated;
    }
  });
};

// Then in useEffect initialize it
useEffect(() => {
  setFormData(prevData => ({
    ...prevData,
    amenities: selectedAmenities
  }));
}, [selectedAmenities]);
  
  const validateBasicInfo = () => {
    const requiredFields = ['title', 'propertyType', 'location', 'description'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        // toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        console.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    if (!formData.priceRangeMin || !formData.priceRangeMax) {
      // toast.error("Please specify the price range for the project");
      console.error("Please specify the price range for the project");
      return false;
    }
    
    if (Number(formData.priceRangeMin) >= Number(formData.priceRangeMax)) {
      // toast.error("Maximum price should be greater than minimum price");
      console.error("Maximum price should be greater than minimum price");
      return false;
    }
    
    if (images.length === 0) {
      // toast.error('Please upload at least one project image');
      console.error('Please upload at least one project image');
      return false;
    }
    
    return true;
  };
  
  const validateLaunchDetails = () => {
    const requiredFields = ['launchDate', 'totalUnits', 'bedrooms', 'contactPhone'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        // toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        console.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    // Validate dates
    if (formData.completionDate && new Date(formData.completionDate) <= new Date(formData.launchDate)) {
      // toast.error("Completion date should be after the launch date");
      console.error("Completion date should be after the launch date");
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateBasicInfo()) {
      setCurrentStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Add this to your frontend component where you submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateBasicInfo()) {
        setCurrentStep(2);
      }
      return;
    }
    
    if (!validateLaunchDetails()) {
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add all required fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'amenities' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
      
      // Add amenities as array
      if (selectedAmenities.length > 0) {
        selectedAmenities.forEach(amenity => {
          formDataToSend.append('amenities', amenity);
        });
      }
      
      // Add images with specific naming for multer
      images.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });
      
      const response = await axios.post(
        `${backendurl}/api/admin/upcoming-projects/create`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Upcoming project created successfully");
        console.log("Upcoming project created successfully");
        setShowModal(false);
        if (onSuccess) onSuccess();
      } else {
        // toast.error(response.data.message || "Failed to create upcoming project");
        console.error(response.data.message || "Failed to create upcoming project");
      }
    } catch (err) {
      console.error("Error creating upcoming project:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to create upcoming project. Please try again."
      // );
      console.error(err.response?.data?.message || "Failed to create upcoming project. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                <Building className="w-5 h-5 text-blue-500 inline mr-2" />
                {currentStep === 1 ? "Add New Upcoming Project - Basic Info" : "Project Launch Details"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <div className={`h-1 w-20 ${currentStep === 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                // Step 1: Basic Project Information
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Project Title</label>
                      </div>
                      <input 
                        type="text" 
                        name="title" 
                        placeholder="Enter project title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Property Type</label>
                      </div>
                      <select 
                        name="propertyType" 
                        value={formData.propertyType} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required
                      >
                        <option value="">Select Property Type</option>
                        {PROPERTY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                      </div>
                      <input 
                        type="text" 
                        name="location" 
                        placeholder="Enter location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Price Range (₹)</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          name="priceRangeMin" 
                          placeholder="Min price" 
                          value={formData.priceRangeMin} 
                          onChange={handleInputChange} 
                          className="w-1/2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                          required 
                        />
                        <span className="text-gray-500">to</span>
                        <input 
                          type="number" 
                          name="priceRangeMax" 
                          placeholder="Max price" 
                          value={formData.priceRangeMax} 
                          onChange={handleInputChange} 
                          className="w-1/2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <label className="block text-sm font-medium text-gray-700">Project Description</label>
                    </div>
                    <textarea 
                      name="description" 
                      placeholder="Enter project description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      rows={4} 
                      required 
                    />
                  </div>
                  
                  {/* Amenities Selection */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {AMENITIES.map(amenity => (
                        <div 
                          key={amenity} 
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-2 rounded-md border cursor-pointer flex items-center gap-2 transition-colors
                            ${selectedAmenities.includes(amenity) 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          {selectedAmenities.includes(amenity) && <CheckCircle className="w-4 h-4 text-blue-500" />}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Images <span className="text-xs text-gray-500">(Maximum 15 images)</span>
                    </label>
                    
                    {/* Drag and Drop Area */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Drag and drop your images here</p>
                      <p className="text-xs text-gray-500">or click to browse files</p>
                    </div>
                    
                    {/* Image Previews */}
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-100">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Step 2: Launch Details
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Launch Date</label>
                      </div>
                      <input 
                        type="date" 
                        name="launchDate" 
                        value={formData.launchDate} 
                        onChange={handleInputChange}
                        min={formatDateForInput(new Date())}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Estimated Completion Date</label>
                      </div>
                      <input 
                        type="date" 
                        name="completionDate" 
                        value={formData.completionDate} 
                        onChange={handleInputChange}
                        min={formData.launchDate}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Total Units</label>
                      <input 
                        type="number" 
                        name="totalUnits" 
                        placeholder="Number of units available" 
                        value={formData.totalUnits} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                      <input 
                        type="text" 
                        name="bedrooms" 
                        placeholder="E.g. 1, 2, 3, 1-3, or 2-4 BHK" 
                        value={formData.bedrooms} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Specifications (Optional)</label>
                    <textarea 
                      name="specifications" 
                      placeholder="Enter project specifications and details" 
                      value={formData.specifications} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Developer Information (Optional)</label>
                    <textarea 
                      name="developerInfo" 
                      placeholder="Enter information about the developer/builder" 
                      value={formData.developerInfo} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    </div>
                    <input 
                      type="tel" 
                      name="contactPhone" 
                      placeholder="Contact phone number for inquiries" 
                      value={formData.contactPhone} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Project Summary</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Title:</span> {formData.title}
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span> {formData.propertyType}
                      </div>
                      <div>
                        <span className="text-gray-500">Price Range:</span> ₹{formData.priceRangeMin} - ₹{formData.priceRangeMax}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span> {formData.location}
                      </div>
                      <div className="col-span-2 mt-2">
                        <span className="text-gray-500">Images:</span> {previewUrls.length} uploaded
                      </div>
                      {selectedAmenities.length > 0 && (
                        <div className="col-span-2 mt-2">
                          <span className="text-gray-500">Amenities:</span> {selectedAmenities.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-3 pt-6">
                {currentStep === 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Next: Launch Details
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Creating Project...
                        </>
                      ) : (
                        <>
                          <Building className="w-4 h-4" />
                          Create Project
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        // <div>hello</div>
      )}
    </AnimatePresence>
  );
};

export default AddUpcomingProjectModal;