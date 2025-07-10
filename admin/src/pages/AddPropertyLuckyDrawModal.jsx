import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { compressImage } from "../utils/imageCompression";
import { 
  Gift, 
  Upload, 
  X, 
  Loader,
  Calendar,
  Home,
  Tag,
  MapPin,
  FileText,
  Bed,
  Bath,
  Square,
  Phone,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";

const PROPERTY_TYPES = ['House', 'Apartment', 'Farmhouse', 'Villa', 'Commercial Properties', 'Shops', 'Office', 'Plots/Lands'];
const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready'];

const AddPropertyLuckyDrawModal = ({ showModal, setShowModal, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    amenities: [],
    availability: 'sell',
    isForInvestment: false,
    invest: '',
    biddingStartDate: '',
    biddingEndDate: ''
  });
  
  const [previewUrls, setPreviewUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  
  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };
  
  const validatePropertyData = () => {
    const requiredFields = ['title', 'type', 'price', 'location', 'description', 'beds', 'baths', 'sqft', 'phone'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        // toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        console.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    if (images.length === 0) {
      // toast.error('Please upload at least one property image');
      console.error('Please upload at least one property image');
      return false;
    }
    
    // If it's an investment property, validate the investment amount
    if (formData.availability === 'sell' && formData.isForInvestment && !formData.invest) {
      // toast.error('Please enter the expected monthly rental income for this investment property');
      console.error('Please enter the expected monthly rental income for this investment property');
      return false;
    }
    
    return true;
  };
  
  const validateLuckyDrawData = () => {
    if (!formData.biddingStartDate || !formData.biddingEndDate) {
      // toast.error("Please set both start and end dates for the lucky draw");
      console.error("Please set both start and end dates for the lucky draw");
      return false;
    }
    
    const startDate = new Date(formData.biddingStartDate);
    const endDate = new Date(formData.biddingEndDate);
    
    if (endDate <= startDate) {
      // toast.error("End date must be after the start date");
      console.error("End date must be after the start date");
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validatePropertyData()) {
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
  
  const handleAvailabilityChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      availability: value,
      // Reset investment data if switching to rent
      isForInvestment: value === 'rent' ? false : prev.isForInvestment,
      invest: value === 'rent' ? '' : prev.invest
    }));
  };
  
  const handleInvestmentChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      isForInvestment: value,
      // Reset investment amount if not an investment property
      invest: value ? prev.invest : ''
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLuckyDrawData()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Create FormData object for the complete submission
      const formDataToSend = new FormData();
      
      // Add all property details to FormData
      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('beds', formData.beds);
      formDataToSend.append('baths', formData.baths);
      formDataToSend.append('sqft', formData.sqft);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('availability', formData.availability);
      formDataToSend.append('isForInvestment', formData.isForInvestment);
      
      if (formData.isForInvestment && formData.invest) {
        formDataToSend.append('invest', formData.invest);
      }
      
      // Add lucky draw dates
      formDataToSend.append('biddingStartDate', formData.biddingStartDate);
      formDataToSend.append('biddingEndDate', formData.biddingEndDate);
      
      // Add amenities as array
      selectedAmenities.forEach(amenity => {
        formDataToSend.append('amenities', amenity);
      });
      
      // Add images with specific naming for multer
      images.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });
      
      // Send the request to the new endpoint that creates property and adds to lucky draw
      const response = await axios.post(
        `${backendurl}/api/admin/lucky-draw/create-with-property`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Property created and added to lucky draw successfully");
        console.log("Property created and added to lucky draw successfully");
        
        // Reset form
        setFormData({
          title: '',
          type: '',
          price: '',
          location: '',
          description: '',
          beds: '',
          baths: '',
          sqft: '',
          phone: '',
          amenities: [],
          availability: 'sell',
          isForInvestment: false,
          invest: '',
          biddingStartDate: '',
          biddingEndDate: ''
        });
        setImages([]);
        setPreviewUrls([]);
        setSelectedAmenities([]);
        setCurrentStep(1);
        
        // Close modal and refresh parent component
        setShowModal(false);
        if (onSuccess) onSuccess();
      } else {
        // toast.error(response.data.message || "Failed to create property for lucky draw");
        console.error(response.data.message || "Failed to create property for lucky draw");
      }
    } catch (err) {
      console.error("Error creating property for lucky draw:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to create property for lucky draw. Please try again."
      // );
      console.error(err.response?.data?.message || "Failed to create property for lucky draw. Please try again.");
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
                <Gift className="w-5 h-5 text-amber-500 inline mr-2" />
                {currentStep === 1 ? "Add New Property for Lucky Draw" : "Set Lucky Draw Details"}
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
                ${currentStep === 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <div className={`h-1 w-20 ${currentStep === 2 ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${currentStep === 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                // Step 1: Property Details
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Property Title</label>
                      </div>
                      <input 
                        type="text" 
                        name="title" 
                        placeholder="Enter property title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Property Type</label>
                      </div>
                      <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
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
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                      </div>
                      <input 
                        type="number" 
                        name="price" 
                        placeholder="Enter price" 
                        value={formData.price} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                    
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
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                    </div>
                    <textarea 
                      name="description" 
                      placeholder="Enter property description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                      rows={4} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Beds</label>
                      </div>
                      <input 
                        type="number" 
                        name="beds" 
                        placeholder="Number of beds" 
                        value={formData.beds} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Baths</label>
                      </div>
                      <input 
                        type="number" 
                        name="baths" 
                        placeholder="Number of baths" 
                        value={formData.baths} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Square className="w-5 h-5 text-gray-500" />
                        <label className="block text-sm font-medium text-gray-700">Sqft</label>
                      </div>
                      <input 
                        type="number" 
                        name="sqft" 
                        placeholder="Square footage" 
                        value={formData.sqft} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    </div>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Contact phone number" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" 
                      required 
                    />
                  </div>
                  
                  {/* Property Availability Options */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Property Availability</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => handleAvailabilityChange("sell")}
                        className={`px-6 py-2 rounded-lg text-white font-medium ${formData.availability === "sell" ? "bg-amber-500" : "bg-gray-400"}`}
                      >
                        For Sale
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleAvailabilityChange("rent")}
                        className={`px-6 py-2 rounded-lg text-white font-medium ${formData.availability === "rent" ? "bg-amber-500" : "bg-gray-400"}`}
                      >
                        For Rent
                      </button>
                    </div>
                  </div>
                  
                  {/* Investment Option (Only for Sale) */}
                  {formData.availability === "sell" && (
                    <div className="space-y-4 mb-6">
                      <label className="block text-sm font-medium text-gray-700">Is this property for investment?</label>
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => handleInvestmentChange(true)}
                          className={`px-6 py-2 rounded-lg text-white font-medium ${formData.isForInvestment ? "bg-amber-500" : "bg-gray-400"}`}
                        >
                          Yes
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleInvestmentChange(false)}
                          className={`px-6 py-2 rounded-lg text-white font-medium ${!formData.isForInvestment ? "bg-amber-500" : "bg-gray-400"}`}
                        >
                          No
                        </button>
                      </div>
                      
                      {formData.isForInvestment && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rental Yield (₹)</label>
                          <input
                            type="number"
                            name="invest"
                            placeholder="Enter expected monthly rental income"
                            value={formData.invest}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
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
                              ? 'border-amber-500 bg-amber-50 text-amber-700' 
                              : 'border-gray-200 hover:border-amber-300'}`}
                        >
                          {selectedAmenities.includes(amenity) && <CheckCircle className="w-4 h-4 text-amber-500" />}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Property Images <span className="text-xs text-gray-500">(Maximum 4 images)</span>
                    </label>
                    
                    {/* Drag and Drop Area */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'}`}
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
                // Step 2: Lucky Draw Details
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-amber-800 mb-2">Lucky Draw Registration Period</h4>
                    <p className="text-sm text-amber-700">
                      Set the time period during which users can register for this lucky draw.
                      The property will automatically be added to the lucky draw after creation.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <label htmlFor="biddingStartDate" className="block text-sm font-medium text-gray-700">
                          Registration Start Date
                        </label>
                      </div>
                      <input
                        type="date"
                        id="biddingStartDate"
                        name="biddingStartDate"
                        value={formData.biddingStartDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        min={formatDateForInput(new Date())}
                        required
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <label htmlFor="biddingEndDate" className="block text-sm font-medium text-gray-700">
                          Registration End Date
                        </label>
                      </div>
                      <input
                        type="date"
                        id="biddingEndDate"
                        name="biddingEndDate"
                        value={formData.biddingEndDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        min={formData.biddingStartDate || formatDateForInput(new Date())}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-800 mb-2">Property Summary</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Title:</span> {formData.title}
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span> {formData.type}
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span> ₹{formData.price}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span> {formData.location}
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span> {formData.sqft} sqft
                      </div>
                      <div>
                        <span className="text-gray-500">Beds/Baths:</span> {formData.beds}/{formData.baths}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Availability:</span> For {formData.availability === "sell" ? "Sale" : "Rent"}
                        {formData.availability === "sell" && formData.isForInvestment && " (Investment Property)"}
                      </div>
                      {formData.isForInvestment && formData.invest && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Monthly Rental Yield:</span> ₹{formData.invest}
                        </div>
                      )}
                      {selectedAmenities.length > 0 && (
                        <div className="col-span-2 mt-2">
                          <span className="text-gray-500">Amenities:</span> {selectedAmenities.join(', ')}
                        </div>
                      )}
                      <div className="col-span-2 mt-2">
                        <span className="text-gray-500">Images:</span> {previewUrls.length} uploaded
                      </div>
                    </div>
                  </div>
                </div>
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
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                    >
                      Next: Set Lucky Draw Details
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
                      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Creating Property...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          Create & Add to Lucky Draw
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPropertyLuckyDrawModal;