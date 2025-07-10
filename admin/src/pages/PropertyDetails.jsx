  import React, { useEffect, useState, useCallback } from "react";
  import { useParams, Link, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { motion, AnimatePresence } from "framer-motion";
  import { 
    BedDouble, 
    Bath, 
    Maximize, 
    Phone, 
    Calendar, 
    MapPin,
    Loader,
    Building,
    Share2,
    ChevronLeft,
    ChevronRight,
    Copy,
    TrendingUp,
    IndianRupee,
    Hash
  } from "lucide-react";
  import { backendurl } from "../App.jsx";

  // Get contact from environment variable
  const defaultContact = import.meta.env.VITE_CONTACT_NUMBER || "99-99-999-999";

  const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);
    const navigate = useNavigate();
    const [showNumber, setShowNumber] = useState(false);

    useEffect(() => {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${backendurl}/api/products/single/${id}`);

          if (response.data.success) {
            setProperty(response.data.property);
          } else {
            setError("Failed to load property details.");
          }
        } catch (err) {
          console.error("Error fetching property:", err);
          setError("Something went wrong!");
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }, [id]);

    useEffect(() => {
      window.scrollTo(0, 0);
      setActiveImage(0);
    }, [id]);

    const handleShare = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 10000);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };

    // Check if property is for investment
    const isForInvestment = property && (property.isForInvestment || (property.invest && property.invest !== ''));
    // Get investment price, preferring monthlyRent if it exists, otherwise use invest
    const investmentPrice = property && (property.monthlyRent || property.invest);

    if (loading) return <div className="text-center text-xl mt-6">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="text-blue-500 flex items-center mb-4">
          <ChevronLeft className="w-5 h-5" /> Back to Listings
        </button>

        {/* Image Carousel */}
        <div className="relative">
          <img
            src={property.image[activeImage]}
            alt="Property"
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
          />
          {/* Serial Number Badge */}
          {property.serialNumber && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
              <Hash className="w-3.5 h-3.5 mr-1" />
              {property.serialNumber}
            </div>
          )}
          {property.image.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage((prev) => (prev === 0 ? property.image.length - 1 : prev - 1))}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setActiveImage((prev) => (prev === property.image.length - 1 ? 0 : prev + 1))}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Property Info */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            {property.serialNumber && (
              <span className="hidden md:inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm text-gray-600">
                <Hash className="w-3.5 h-3.5 mr-1" />
                {property.serialNumber}
              </span>
            )}
          </div>
          <p className="text-gray-600">{property.description}</p>
          
          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {property.location}
            </div>
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              {property.type}
            </div>
            <div className="flex items-center">
              <Maximize className="w-5 h-5 mr-2" />
              {property.sqft} sqft
            </div>
            <div className="flex items-center">
              <BedDouble className="w-5 h-5 mr-2" />
              {property.beds} Bedrooms
            </div>
            <div className="flex items-center">
              <Bath className="w-5 h-5 mr-2" />
              {property.baths} Bathrooms
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Available from {new Date(property.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Investment Info - Only show if property is for investment */}
          {isForInvestment && investmentPrice && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-amber-700">Investment Opportunity</h3>
              </div>
              <div className="flex items-center mb-2">
                <IndianRupee className="w-5 h-5 text-amber-500 mr-1" />
                <span className="text-xl font-bold text-amber-500">
                  {Number(investmentPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-amber-700 ml-2">/month rental income</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-gray-700">Annual Yield: </span>
                  <span className="font-semibold text-amber-700">
                    {((Number(investmentPrice) * 12 / Number(property.price)) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-gray-700">ROI Period: </span>
                  <span className="font-semibold text-amber-700">
                    {(Number(property.price) / (Number(investmentPrice) * 12)).toFixed(1)} years
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Property Details with Serial Number */}
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <div className="flex items-center mb-3">
              <Hash className="w-4 h-4 mr-2 text-gray-600" />
              <h3 className="text-lg font-semibold">Property Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {property.serialNumber && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-700">ID: <span className="font-medium">#{property.serialNumber}</span></span>
                </div>
              )}
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-sm text-gray-700">Type: <span className="font-medium">{property.type}</span></span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-sm text-gray-700">Added: <span className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</span></span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <h3 className="text-xl font-semibold mt-6">Amenities</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-disc pl-5 text-gray-600">
            {property.amenities?.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>

          {/* Price & Contact */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-green-600">₹{Number(property.price).toLocaleString('en-IN')}</h2>
              {property.serialNumber && (
                <span className="md:hidden ml-2 bg-gray-100 rounded-md px-2 py-1 text-xs text-gray-600 flex items-center">
                  <Hash className="w-3 h-3 mr-0.5" />
                  #{property.serialNumber}
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-2 w-45">
                <button 
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
                  onClick={() => setShowNumber(!showNumber)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={showNumber} 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      className="whitespace-nowrap"
                    >
                      {showNumber ? (property.phone || defaultContact) : "Contact Owner"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              <button className="w-30 flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-2" />
                {copySuccess ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  export default PropertyDetails;