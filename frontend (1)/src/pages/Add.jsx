import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Backendurl } from "../App";
import { compressImage } from "../utils/imageCompression";

import {
  Upload,
  X,
  Home,
  Building,
  DollarSign,
  MapPin,
  Pencil,
  Bed,
  Bath,
  Square,
  Phone,
  CheckCircle2,
  Image as ImageIcon,
  Loader,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

// Maximum number of photos allowed for property
const MAX_PHOTOS = 15;

const PROPERTY_TYPES = [
  { value: "House", icon: <Home size={24} /> },
  { value: "Apartment", icon: <Building size={24} /> },
  { value: "Farmhouse", icon: <Home size={24} /> },
  { value: "Villa", icon: <Home size={24} /> },
  { value: "Commercial", icon: <Building size={24} /> },
  { value: "Shops", icon: <Building size={24} /> },
  { value: "Office", icon: <Building size={24} /> },
  { value: "Plots/Lands", icon: <MapPin size={24} /> },
];

const AMENITIES = [
  "Lake View",
  "Fireplace",
  "Central AC",
  "Dock",
  "Pool",
  "Garage",
  "Garden",
  "Gym",
  "Security System",
  "Master Bathroom",
  "Guest Bathroom",
  "Home Theater",
  "Exercise Room",
  "Covered Parking",
  "High-Speed Internet",
];

const PropertyForm = () => {
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState("");
  const [isForInvestment, setIsForInvestment] = useState(false);
  const [isHotDeal, setIsHotDeal] = useState(false);
  

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    location: "",
    description: "",
    beds: "",
    baths: "",
    sqft: "",
    phone: "",
    amenities: [],
    images: [],
    invest: "",
    owner: "",
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await axios.get(`${Backendurl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Set admin status based on user data
        if (response.data && response.data.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdminStatus();
  }, []);
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processAndAddImages(files);
  };
  
  const processAndAddImages = async (files) => {
    if (files.length + previewUrls.length > MAX_PHOTOS) {
      toast.error(`Maximum ${MAX_PHOTOS} images allowed`);
      console.error(`Maximum ${MAX_PHOTOS} images allowed`);
      return;
    }
  
    // Show compression loading state
    setLoading(true);
    
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
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...compressedFiles] }));
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addImages = (files) => {
    if (files.length + previewUrls.length > MAX_PHOTOS) {
      console.error("Maximum 15 images allowed");
      return;
    }
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up to prevent memory leaks
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processAndAddImages(Array.from(e.dataTransfer.files));
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const sellButtonHandle = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    try {
      const token = await localStorage.getItem("token");

      if (!token) {
          console.error("Log in to Sell Property");
          return;
      }

      setAvailability("sell");
    } catch (err) {
        console.log("Error : ", err);
        return;
    } finally {
        setLoading(false);
    }
  } 

  const rentButtonHandle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await localStorage.getItem("token");

      if (!token) {
          console.error("Log in to Rent Property");
          return;
      }

      setAvailability("rent");
    } catch (err) {
        console.log("Error : ", err);
        return;
    } finally {
        setLoading(false);
    }
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Log in to add property");
        return;
      }
      
      // Get user details to get the user ID
      const userResponse = await axios.get(`${Backendurl}/api/users/me`);
      
      // Extract user ID from response
      const userId = userResponse.data._id;
      console.log('User ID:', userId);
      
      // Create a new FormData object
      const formdata = new FormData();
      
      // Add all the text fields to FormData
      formdata.append("title", formData.title);
      formdata.append("location", formData.location);
      formdata.append("price", formData.price);
      formdata.append("beds", formData.beds);
      formdata.append("baths", formData.baths);
      formdata.append("sqft", formData.sqft);
      formdata.append("type", formData.type);
      formdata.append("description", formData.description);
      formdata.append("phone", formData.phone);
      formdata.append("invest", formData.invest || "");
      formdata.append("availability", availability);
      formdata.append("isForInvestment", isForInvestment);
      formdata.append("isHotDeal", isHotDeal);
      
      // Add the user ID as the owner
      formdata.append("owner", userId);
      
      // Handle amenities as JSON string
      if (formData.amenities && formData.amenities.length > 0) {
        formdata.append("amenities", JSON.stringify(formData.amenities));
      }
      
      // Properly append each image file with its own key
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          // Make sure image is a valid File object before appending
          if (image instanceof File) {
            formdata.append(`image${index + 1}`, image);
            console.log(`Appending image${index + 1}:`, image.name, image.type, image.size);
          }
        });
      } else {
        console.warn("No images found in formData.images");
      }
      
      // Send the request with the formdata
      const response = await axios.post(
        `${Backendurl}/api/products/add`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      
      if (response.data.success) {
        console.log("Property added successfully:", response.data.message);
        // Reset form after successful submission
        setFormData({
          title: "",
          type: "",
          price: "",
          location: "",
          description: "",
          beds: "",
          baths: "",
          sqft: "",
          phone: "",
          amenities: [],
          images: [],
          invest: "",
        });
        setPreviewUrls([]);
        setAvailability("");
        setIsForInvestment(false);
        setStep(1);
      } else {
        console.error("Error adding property:", response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };


  // Background gradient pattern
  const bgPattern = (
    <div className="absolute inset-0 z-0 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );

  return (
    <>
    
    <Helmet>
        {/* Page Title */}
        <title>List Your Property - Sell or Rent | Hybrid Realty</title>
        
        {/* Meta Description */}
        <meta 
          name="description" 
          content="Easily list your property for sale or rent with Hybrid Realty. Add detailed property information, upload photos, and reach potential buyers or tenants quickly and securely."
        />
        
        {/* Keywords */}
        <meta 
          name="keywords" 
          content="list property, sell property, rent property, real estate listing, property upload, property details, property photos"
        />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="List Your Property - Sell or Rent | Hybrid Realty" />
        <meta 
          property="og:description" 
          content="Easily list your property for sale or rent with Hybrid Realty. Add detailed property information, upload photos, and reach potential buyers or tenants quickly and securely."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta 
          property="og:image" 
          content="/property-listing-og-image.jpg" 
        />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="List Your Property - Sell or Rent | Hybrid Realty" />
        <meta 
          name="twitter:description" 
          content="Easily list your property for sale or rent with Hybrid Realty. Add detailed property information, upload photos, and reach potential buyers or tenants quickly and securely."
        />
        <meta 
          name="twitter:image" 
          content="/property-listing-og-image.jpg" 
        />
      </Helmet>


      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Property Listing Form",
        "description": "A platform to list properties for sale or rent",
        "mainEntity": {
          "@type": "WebPage",
          "name": "List Your Property",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/properties/add`
            }
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hybrid Realty",
          "url": window.location.origin
        }
      })}
    </script>




      <div className="w-full overflow-x-clip min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-24 relative">
      {bgPattern}
      <div className="absolute opacity-10 -left-28 -top-28 w-96 h-96 bg-[var(--theme-color-1)] rounded-full filter blur-3xl"></div>
      <div className="absolute opacity-10 -right-28 -bottom-28 w-96 h-96 bg-[var(--theme-hover-color-1)] rounded-full filter blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-4xl relative z-10"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-[var(--theme-color-1)] text-white"
                      : "bg-gray-200 text-gray-500"
                  } transition-colors duration-300`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step >= stepNumber
                      ? "text-[var(--theme-color-1)] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {stepNumber === 1
                    ? "Type & Price"
                    : stepNumber === 2
                    ? "Details"
                    : "Photos"}
                </span>
              </div>
            ))}

            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
              <motion.div
                className="h-full bg-[var(--theme-color-1)]"
                initial={{ width: "0%" }}
                animate={{ width: `${(step - 1) * 50}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Initial Listing Type Selection */}
          {!availability ? (
            <motion.div
              key="listing-type"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What would you like to do?
              </h2>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Select whether you want to list your property for sale or for
                rent.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sellButtonHandle}
                  className="group relative overflow-hidden h-48 rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="w-16 h-16 rounded-full bg-green-500 group-hover:bg-green-600 flex items-center justify-center mb-4 transition-colors duration-300">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800">
                      Sell a Property
                    </h3>
                    <p className="text-sm text-green-700 mt-2 max-w-xs">
                      List your property for sale on our marketplace
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={rentButtonHandle}
                  className="group relative overflow-hidden h-48 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="w-16 h-16 rounded-full bg-[var(--theme-color-1)] group-hover:bg-[var(--theme-hover-color-1)] flex items-center justify-center mb-4 transition-colors duration-300">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-800">
                      Rent a Property
                    </h3>
                    <p className="text-sm text-blue-700 mt-2 max-w-xs">
                      List your property for rent on our marketplace
                    </p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Step 1: Basic Information */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {availability === "sell"
                          ? "Sell Your Property"
                          : "Rent Your Property"}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Let's start with the basic information
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Property Title
                        </label>
                        <div
                          className={`relative group ${
                            focusedField === "title"
                              ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                              : ""
                          }`}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                            <Pencil size={18} />
                          </div>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="e.g. Modern Villa with Lake View"
                            value={formData.title}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("title")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                              focusedField === "title"
                                ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                            required
                          />
                        </div>
                      </div>

                      {/* Property Type */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Property Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {PROPERTY_TYPES.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  type: type.value,
                                }))
                              }
                              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                formData.type === type.value
                                  ? "border-[var(--theme-color-1)] bg-blue-50 text-[var(--theme-color-1)]"
                                  : "border-gray-200 hover:border-[var(--theme-color-1)]/50 text-gray-600 hover:bg-blue-50/50"
                              }`}
                            >
                              <div
                                className={`mb-2 ${
                                  formData.type === type.value
                                    ? "text-[var(--theme-color-1)]"
                                    : "text-gray-400"
                                }`}
                              >
                                {type.icon}
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  formData.type === type.value
                                    ? "text-[var(--theme-color-1)]"
                                    : "text-gray-700"
                                }`}
                              >
                                {type.value}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Price (₹)
                        </label>
                        <div
                          className={`relative group ${
                            focusedField === "price"
                              ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                              : ""
                          }`}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                            <DollarSign size={18} />
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder={
                              availability === "sell"
                                ? "Selling Price"
                                : "Monthly Rent"
                            }
                            value={formData.price}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("price")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                              focusedField === "price"
                                ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                            required
                          />
                        </div>
                      </div>
                      

                      {/* Hot Deal Toggle */}
                      {isAdmin && (
                        <div className="p-5 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              List as Hot Deal
                            </label>
                            <p className="text-xs text-gray-500">
                              Hot deals are highlighted and shown at the top of search results
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => setIsHotDeal(!isHotDeal)}
                              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                isHotDeal ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'
                              }`}
                              aria-pressed={isHotDeal}
                            >
                              <motion.span
                                layout
                                className={`bg-white w-5 h-5 rounded-full shadow-md`}
                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {/* Show badge preview when hot deal is enabled */}
                        {isHotDeal && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 flex items-center"
                          >
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs uppercase font-bold rounded-full px-3 py-1.5 mr-2">
                              Hot Deal
                            </div>
                            <span className="text-xs text-gray-600">Preview of the hot deal badge</span>
                          </motion.div>
                        )}
                      </div>
                      )}
                      
                      {/* Investment Option (Only for Sell) */}
                      {availability === "sell" && (
                        <div className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-blue-100">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Is this property available for investment?
                          </label>
                          <div className="flex gap-4">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setIsForInvestment(true)}
                              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                                isForInvestment
                                  ? "bg-green-500 text-white shadow-md"
                                  : "bg-white text-gray-700 border border-gray-200 hover:border-green-300"
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <CheckCircle2 size={18} />
                                <span>Yes, for investment</span>
                              </div>
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setIsForInvestment(false)}
                              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                                !isForInvestment
                                  ? "bg-blue-500 text-white shadow-md"
                                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <X size={18} />
                                <span>No, regular sale</span>
                              </div>
                            </motion.button>
                          </div>

                          {/* Monthly Rental Yield (if investment) */}
                          {isForInvestment && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4"
                            >
                              <label
                                htmlFor="invest"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Expected Monthly Rental Income (₹)
                              </label>
                              <div
                                className={`relative group ${
                                  focusedField === "invest"
                                    ? "ring-2 ring-green-200 rounded-lg"
                                    : ""
                                }`}
                              >
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors">
                                  <DollarSign size={18} />
                                </div>
                                <input
                                  type="number"
                                  id="invest"
                                  name="invest"
                                  placeholder="Monthly Rental Income"
                                  value={formData.invest}
                                  onChange={handleInputChange}
                                  onFocus={() => setFocusedField("invest")}
                                  onBlur={() => setFocusedField(null)}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                                    focusedField === "invest"
                                      ? "bg-green-50 border-green-300"
                                      : "bg-white border-gray-200 hover:border-green-300"
                                  } border focus:border-green-400 transition-all duration-200 outline-none`}
                                  required
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Location */}
                      <div className="space-y-2">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <div
                          className={`relative group ${
                            focusedField === "location"
                              ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                              : ""
                          }`}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                            <MapPin size={18} />
                          </div>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="e.g. 123 Main Street, City, State"
                            value={formData.location}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("location")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                              focusedField === "location"
                                ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                            required
                          />
                        </div>
                      </div>

                      {/* Next Button */}
                      <div className="pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={nextStep}
                          className="w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                          disabled={
                            !formData.title ||
                            !formData.type ||
                            !formData.price ||
                            !formData.location ||
                            (isForInvestment && !formData.invest)
                          }
                        >
                          Continue to Property Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 2: Property Details */}
              <AnimatePresence mode="wait">
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Property Details
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Tell us more about your property
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Description */}
                      <div className="space-y-2">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div
                          className={`relative group ${
                            focusedField === "description"
                              ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                              : ""
                          }`}
                        >
                          <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your property in detail..."
                            value={formData.description}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("description")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full p-4 rounded-lg ${
                              focusedField === "description"
                                ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none resize-none`}
                            rows={4}
                            required
                          />
                        </div>
                      </div>

                      {/* Property Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Beds */}
                        <div className="space-y-2">
                          <label
                            htmlFor="beds"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bedrooms
                          </label>
                          <div
                            className={`relative group ${
                              focusedField === "beds"
                                ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                                : ""
                            }`}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                              <Bed size={18} />
                            </div>
                            <input
                              type="number"
                              id="beds"
                              name="beds"
                              placeholder="e.g. 3"
                              value={formData.beds}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField("beds")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                                focusedField === "beds"
                                  ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                              required
                            />
                          </div>
                        </div>

                        {/* Baths */}
                        <div className="space-y-2">
                          <label
                            htmlFor="baths"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bathrooms
                          </label>
                          <div
                            className={`relative group ${
                              focusedField === "baths"
                                ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                                : ""
                            }`}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                              <Bath size={18} />
                            </div>
                            <input
                              type="number"
                              id="baths"
                              name="baths"
                              placeholder="e.g. 2"
                              value={formData.baths}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField("baths")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                                focusedField === "baths"
                                  ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                              required
                            />
                          </div>
                        </div>

                        {/* Area */}
                        <div className="space-y-2">
                          <label
                            htmlFor="sqft"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Area (sqft)
                          </label>
                          <div
                            className={`relative group ${
                              focusedField === "sqft"
                                ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                                : ""
                            }`}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                              <Square size={18} />
                            </div>
                            <input
                              type="number"
                              id="sqft"
                              name="sqft"
                              placeholder="e.g. 1200"
                              value={formData.sqft}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField("sqft")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                                focusedField === "sqft"
                                  ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Contact Phone
                        </label>
                        <div
                          className={`relative group ${
                            focusedField === "phone"
                              ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                              : ""
                          }`}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                            <Phone size={18} />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Your contact number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                              focusedField === "phone"
                                ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200 outline-none`}
                            required
                          />
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Amenities & Features
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {AMENITIES.map((amenity) => (
                            <motion.button
                              key={amenity}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleAmenity(amenity)}
                              className={`flex items-center text-left p-3 rounded-lg border transition-all ${
                                formData.amenities.includes(amenity)
                                  ? "border-[var(--theme-color-1)] bg-blue-50"
                                  : "border-gray-200 hover:border-[var(--theme-color-1)]/50 hover:bg-blue-50/50"
                              }`}
                            >
                              <CheckCircle2
                                size={18}
                                className={`mr-2 ${
                                  formData.amenities.includes(amenity)
                                    ? "text-[var(--theme-color-1)]"
                                    : "text-gray-300"
                                }`}
                              />
                              <span className="text-sm">{amenity}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={prevStep}
                          className="w-1/4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={nextStep}
                          className="w-3/4 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                          disabled={
                            !formData.description ||
                            !formData.beds ||
                            !formData.baths ||
                            !formData.sqft ||
                            !formData.phone
                          }
                        >
                          Continue to Photos
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Image Upload */}
              <AnimatePresence mode="wait">
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Property Photos
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Add up to 15 photos of your property
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Image Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          dragActive
                            ? "border-[var(--theme-color-1)] bg-blue-50"
                            : "border-gray-300 hover:border-[var(--theme-color-1)] hover:bg-blue-50/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                      >
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden outline-none"
                        />

                        <AnimatePresence mode="wait">
                          {previewUrls.length === 0 ? (
                            <motion.div
                              key="upload-prompt"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col items-center"
                            >
                              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                                <Upload className="h-8 w-8 text-[var(--theme-color-1)]" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-700 mb-1">
                                Drag and drop your images here
                              </h3>
                              <p className="text-sm text-gray-500 mb-4">
                                or click to browse your files
                              </p>
                              <p className="text-xs text-gray-400">
                                Maximum 15 images (JPEG, PNG)
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="upload-more"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col items-center py-4"
                            >
                              {previewUrls.length < 4 && (
                                <>
                                  <PlusCircle className="h-8 w-8 text-[var(--theme-color-1)] mb-2" />
                                  <p className="text-sm font-medium text-gray-700">
                                    Add {MAX_PHOTOS - previewUrls.length} more{" "}
                                    {MAX_PHOTOS - previewUrls.length === 1 ? "photo" : "photos"}
                                  </p>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Image Previews */}
                      {previewUrls.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-700">
                            Your Property Photos ({previewUrls.length}/15)
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previewUrls.map((url, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative group rounded-xl overflow-hidden h-40 bg-gray-100 shadow-md"
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-100 transition-colors"
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={prevStep}
                          className="w-1/4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={loading || previewUrls.length === 0}
                          className="w-3/4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <Loader className="animate-spin mr-2 h-5 w-5" />
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircle2 className="mr-2 h-5 w-5" />
                              <span>Submit Property</span>
                            </div>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </>
    
  );
};

export default PropertyForm;