import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  Loader,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  Search,
  Compass,
  TrendingUp,
  IndianRupee,
  Hash,
  Heart,
  CheckCircle,
  Home,
  PencilRuler,
  Square,
  Clock,
  CalendarCheck,
  BadgeCheck,
  Sparkles,
  BookMarked,
  X,
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing.jsx";
import { toast } from "react-toastify";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token") !== null;

  // Format price with Indian currency formatting and compact notation
  const formatPrice = (price) => {
    if (!price) return "—";

    // If price is already formatted with ₹ symbol, extract just the number part
    let numericPrice = price;
    if (typeof price === "string" && price.includes("₹")) {
      numericPrice = price.replace(/[₹,\s]/g, "");
    }

    // Convert to number
    const amount = Number(numericPrice);
    if (isNaN(amount)) return price; // Return original if conversion fails

    // Format based on the amount
    if (amount >= 10000000) {
      // Format in crores (≥ 1 crore)
      const crores = (amount / 10000000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: amount % 10000000 === 0 ? 0 : 1,
      });
      return (
        <>
          {crores}
          <span className="ml-1 text-sm font-medium">Cr</span>
        </>
      );
    } else if (amount >= 100000) {
      // Format in lakhs (≥ 1 lakh)
      const lakhs = (amount / 100000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: amount % 100000 === 0 ? 0 : 1,
      });
      return (
        <>
          {lakhs}
          <span className="ml-1 text-sm font-medium">L</span>
        </>
      );
    } else if (amount >= 1000) {
      // Format in thousands (≥ 1,000)
      const thousands = (amount / 1000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: amount % 1000 === 0 ? 0 : 1,
      });
      return (
        <>
          {thousands}
          <span className="ml-1 text-sm font-medium">K</span>
        </>
      );
    } else {
      // Regular formatting with commas
      return amount.toLocaleString("en-IN");
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${Backendurl}/api/products/single/${id}`
        );

        if (response.data.success) {
          const propertyData = response.data.property;
          setProperty({
            ...propertyData,
            amenities: parseAmenities(propertyData.amenities),
          });
          setError(null);
        } else {
          setError(response.data.message || "Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Check if property is in user's wishlist
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isLoggedIn || !id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${Backendurl}/api/users/check-favorite/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
        // Don't show error to user for this call
      }
    };

    checkFavoriteStatus();
  }, [id, isLoggedIn]);

  useEffect(() => {
    // Reset scroll position and active image when component mounts
    window.scrollTo(0, 0);
    setActiveImage(0);

    // Handle scroll for sticky sidebar
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  const parseAmenities = (amenities) => {
    if (!amenities || !Array.isArray(amenities)) return [];

    try {
      return amenities;
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  const handleKeyNavigation = useCallback(
    (e) => {
      if (!property) return;

      if (e.key === "ArrowLeft") {
        setActiveImage((prev) =>
          prev === 0 ? property.image.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImage((prev) =>
          prev === property.image.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape") {
        if (isImageFullscreen) {
          setIsImageFullscreen(false);
        } else if (showSchedule) {
          setShowSchedule(false);
        }
      }
    },
    [property, showSchedule, isImageFullscreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type}: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        // toast.success("Link copied to clipboard!");
        console.log("Link copied to clipboard!");
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Toggle favorite/wishlist status
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      // toast.info("Please login to save properties to your wishlist");
      console.log("Please login to save properties to your wishlist");
      navigate("/login");
      return;
    }

    try {
      setFavoriteLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${Backendurl}/api/users/toggle-wishlist`,
        { propertyId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsFavorite(response.data.isInWishlist);
        // toast.success(response.data.message);
        console.log(response.data.message);
      } else {
        // toast.error(response.data.message || "Something went wrong");
        console.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // toast.error("Failed to update wishlist. Please try again.");
      console.error("Failed to update wishlist:", error.response?.data?.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Check if property is for investment
  const isForInvestment =
    property &&
    (property.isForInvestment || (property.invest && property.invest !== ""));
  // Get investment price, preferring monthlyRent if it exists, otherwise use invest
  const investmentPrice = property && (property.monthlyRent || property.invest);

  // Calculate ROI metrics
  const calculateAnnualYield = () => {
    if (!property || !investmentPrice) return "0.00";
    return (
      ((Number(investmentPrice) * 12) / Number(property.price)) *
      100
    ).toFixed(2);
  };

  const calculateROIPeriod = () => {
    if (!property || !investmentPrice) return "0.0";
    return (Number(property.price) / (Number(investmentPrice) * 12)).toFixed(1);
  };

  // Scroll image to thumbnail
  const scrollToImage = (index) => {
    setActiveImage(index);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Background pattern
  const bgPattern = (
    <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white relative overflow-hidden pt-16">
        {bgPattern}

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-lg">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl bg-blue-500/20"
            />
            <Home className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Loading Property Details
          </h3>

          <p className="text-gray-600 mb-6">
            We're retrieving the information for this property. Please wait a
            moment...
          </p>

          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)]"
              animate={{
                width: ["0%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </div>

          <div className="text-sm text-gray-500 flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-[var(--theme-color-1)] rounded-full mr-2"
            />
            Loading information and images...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white relative overflow-hidden pt-16">
        {bgPattern}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md relative z-10 border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something Went Wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-300 font-medium"
            >
              Refresh
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/properties")}
              className="px-5 py-2 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 relative overflow-hidden"
    >
      {bgPattern}

      {/* Decorative blobs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)] bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <motion.div whileHover={{ x: -3 }} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Properties</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                transition-all duration-300 relative ${
                  isFavorite
                    ? "text-red-600 hover:bg-red-50 border border-red-200 bg-white/80 backdrop-blur-sm"
                    : "text-gray-700 hover:bg-gray-100/70 border border-gray-200 bg-white/80 backdrop-blur-sm"
                }`}
            >
              {favoriteLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`}
                />
              )}
              {isFavorite ? "Saved" : "Save"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                hover:bg-gray-100/70 border border-gray-200 transition-all duration-300 relative bg-white/80 backdrop-blur-sm"
            >
              {copySuccess ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-green-600 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Copied!
                </motion.span>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share
                </>
              )}
            </motion.button>
          </div>
        </motion.nav>

        {/* Property ID and Type Labels - Top of page */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {property.serialNumber && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
              <Hash className="w-4 h-4 mr-1.5" />
              Property #{property.serialNumber}
            </div>
          )}

          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
            <Home className="w-4 h-4 mr-1.5" />
            {property.type}
          </div>

          <div
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm
            ${
              property.availability === "rent"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <BadgeCheck className="w-4 h-4 mr-1.5" />
            For {property.availability === "rent" ? "Rent" : "Sale"}
          </div>

          {isForInvestment && (
            <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Investment Property
            </div>
          )}

          <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm ml-auto">
            <Clock className="w-4 h-4 mr-1.5" />
            Listed {formatDate(property.createdAt)}
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-[var(--theme-color-1)]" />
            {property.location}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Images and Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {/* Main Image */}
              <div className="relative rounded-t-2xl overflow-hidden">
                <div
                  className="h-[400px] md:h-[500px] bg-gray-100 rounded-t-2xl overflow-hidden cursor-pointer"
                  onClick={() => setIsImageFullscreen(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={property.image[activeImage]}
                      alt={`${property.title} - View ${activeImage + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>

                {/* Favorite Button - Top Right */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`absolute top-4 right-4 p-3 rounded-full
                    bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300
                    shadow-md z-10 ${
                      isFavorite ? "text-red-500" : "text-gray-600"
                    }`}
                >
                  {favoriteLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                  )}
                </motion.button>

                {/* Zoom Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsImageFullscreen(true)}
                  className="absolute top-4 left-4 p-3 rounded-full
                    bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300
                    shadow-md z-10 text-gray-600"
                >
                  <Maximize className="w-6 h-6" />
                </motion.button>

                {/* Serial Number Badge */}
                {property.serialNumber && (
                  <div className="absolute top-4 left-20 bg-blue-600/90 text-white px-3 py-1.5 rounded-lg font-medium flex items-center z-10">
                    <Hash className="w-4 h-4 mr-1.5" />
                    <span> {property.serialNumber}</span>
                  </div>
                )}

                {/* Image Navigation */}
                {property.image.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === 0 ? property.image.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                        bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === property.image.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                        bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}

                {/* Image Counter */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 
                  bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {activeImage + 1} / {property.image.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.image.length > 1 && (
                <div className="flex p-3 gap-2 bg-white overflow-x-auto">
                  {property.image.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToImage(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
                        activeImage === index
                          ? "border-[var(--theme-color-1)]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{ width: "80px", height: "60px" }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {activeImage === index && (
                        <div className="absolute inset-0 bg-[var(--theme-color-1)]/10 border-2 border-[var(--theme-color-1)] rounded-lg"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Description and Features */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PencilRuler className="w-5 h-5 text-[var(--theme-color-1)]" />
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Property Features Grid */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--theme-color-1)]" />
                  Property Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center">
                    <BedDouble className="w-8 h-8 text-[var(--theme-color-1)] mb-3" />
                    <p className="text-lg font-semibold text-gray-800">
                      {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Comfortable Sleeping Areas
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center">
                    <Bath className="w-8 h-8 text-[var(--theme-color-1)] mb-3" />
                    <p className="text-lg font-semibold text-gray-800">
                      {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
                    </p>
                    <p className="text-sm text-gray-500">Modern Bathrooms</p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center">
                    <Square className="w-8 h-8 text-[var(--theme-color-1)] mb-3" />
                    <p className="text-lg font-semibold text-gray-800">
                      {property.sqft} sqft
                    </p>
                    <p className="text-sm text-gray-500">Living Space</p>
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[var(--theme-color-1)]" />
                  Amenities & Facilities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                        <CheckCircle className="w-4 h-4 text-[var(--theme-color-1)]" />
                      </div>
                      <span className="group-hover:text-[var(--theme-color-1)] transition-colors">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section with Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <div className="flex items-center gap-2 text-gray-900 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[var(--theme-color-1)]" />
                </div>
                <h2 className="text-xl font-bold">Location</h2>
              </div>

              <p className="text-gray-700 mb-4 pl-12">{property.location}</p>

              {/* Map Placeholder - You would integrate Google Maps here */}
              <div className="relative h-64 bg-blue-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <MapPin className="w-10 h-10 text-[var(--theme-color-1)] absolute" />
                <div className="absolute inset-0 bg-blue-200/20"></div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  property.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)] border border-[var(--theme-color-1)] hover:border-[var(--theme-hover-color-1)] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </motion.div>

          {/* Right Column - Price and Contact Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`${
              isSticky ? "lg:self-start lg:sticky lg:top-24" : ""
            } transition-all duration-300`}
          >
            {/* Property Price Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {property.availability === "rent"
                      ? "Rental Price"
                      : "Sale Price"}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.availability === "rent"
                        ? "bg-purple-700/40 text-white"
                        : "bg-green-700/40 text-white"
                    }`}
                  >
                    For {property.availability === "rent" ? "Rent" : "Sale"}
                  </div>
                </div>
                <div className="mt-2 flex items-baseline">
                  <IndianRupee className="w-6 h-6" />
                  <span className="text-3xl font-bold">
                    {formatPrice(property.price)}
                  </span>
                  {property.availability === "rent" && (
                    <span className="ml-1 text-sm opacity-80">/month</span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Investment Details - Only shown for investment properties */}
                {isForInvestment && investmentPrice && (
                  <div className="mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-700 mb-3">
                      <TrendingUp className="w-5 h-5" />
                      Investment Opportunity
                    </h3>

                    <div className="flex items-center mb-2">
                      <IndianRupee className="w-5 h-5 text-amber-500" />
                      <span className="text-2xl font-bold text-amber-500 ml-1">
                        {formatPrice(investmentPrice)}
                      </span>
                      <span className="text-amber-700 ml-2">
                        /month rental income
                      </span>
                    </div>

                    <div className="space-y-2 mt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Yield:</span>
                        <span className="font-semibold text-amber-700">
                          {calculateAnnualYield()}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI Period:</span>
                        <span className="font-semibold text-amber-700">
                          {calculateROIPeriod()} years
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Details
                  </h3>
                  <div className="flex items-center text-gray-700 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-[var(--theme-color-1)]" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {import.meta.env.VITE_CONTACT_NUMBER || "9999999999"}
                      </p>
                      <p className="text-xs text-gray-500">Call or WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-[var(--theme-color-1)]" />
                    </div>
                    <div>
                      <p className="font-medium">hybridrealty@gmail.com</p>
                      <p className="text-xs text-gray-500">Send us an email</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSchedule(true)}
                    className="w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3 rounded-xl 
                      hover:shadow-lg transition-all duration-300 flex items-center 
                      justify-center gap-2 font-medium"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    Schedule a Viewing
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2
                      transition-all duration-300 font-medium ${
                        isFavorite
                          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                  >
                    {favoriteLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite ? "fill-red-500" : ""
                          }`}
                        />
                        {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
                      </>
                    )}
                  </motion.button>

                  <a
                    href={`tel:${
                      import.meta.env.VITE_CONTACT_NUMBER || "9999999999"
                    }`}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Property Information Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-[var(--theme-color-1)]" />
                Property Information
              </h3>

              <div className="space-y-4">
                {property.serialNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <BookMarked className="w-4 h-4 text-[var(--theme-color-1)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Property ID</p>
                      <p className="font-semibold text-gray-800">
                        #{property.serialNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Home className="w-4 h-4 text-[var(--theme-color-1)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-semibold text-gray-800">
                      {property.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Square className="w-4 h-4 text-[var(--theme-color-1)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold text-gray-800">
                      {property.sqft} Square Feet
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[var(--theme-color-1)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Listed Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(property.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Properties Placeholder - You could implement this */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Looking for Similar Properties?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Explore more options in this area or with similar features to find
            your perfect match.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Explore All Properties
          </Link>
        </motion.div>

        {/* Fullscreen Image Gallery Modal */}
        <AnimatePresence>
          {isImageFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <button
                onClick={() => setIsImageFullscreen(false)}
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-5xl"
              >
                <div className="relative">
                  <img
                    src={property.image[activeImage]}
                    alt={`${property.title} - View ${activeImage + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />

                  {property.image.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImage((prev) =>
                            prev === 0 ? property.image.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                          bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImage((prev) =>
                            prev === property.image.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                          bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 text-white">
                  <span>{property.title}</span>
                  <span>
                    {activeImage + 1} / {property.image.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Camera icon component for image counter
const Camera = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export default PropertyDetails;
