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
  Compass,
  TrendingUp,
  IndianRupee,
  Hash,
  Heart,
  CheckCircle,
  PieChart,
  DollarSign,
  ArrowRight,
  BarChart4,
  Sparkles,
  X,
  Clock,
  Home,
  Mail,
  Calculator,
  Maximize2,
  Square,
  FileText,
  Download,
  Percent,
  BookMarked,
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing.jsx";
import { toast } from "react-toastify";

const InvestPropertyDetails = () => {
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
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    downPayment: 20,
    interestRate: 7.5,
    loanTerm: 20,
  });
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token") !== null;

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
      setIsSticky(window.scrollY > 300);
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
        } else if (showCalculator) {
          setShowCalculator(false);
        } else if (showSchedule) {
          setShowSchedule(false);
        }
      }
    },
    [property, showSchedule, isImageFullscreen, showCalculator]
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
          text: `Check out this investment property: ${property.title}`,
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
        toast.success(response.data.message);
      } else {
        // toast.error(response.data.message || "Something went wrong");
        console.error("Failed to update wishlist:", response.data.message);
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

  // Scroll image to thumbnail
  const scrollToImage = (index) => {
    setActiveImage(index);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate investment metrics
  const calculateROI = () => {
    if (!property || !investmentPrice)
      return { annualYield: 0, roiYears: 0, totalReturn: 0 };

    const monthlyIncome = Number(investmentPrice);
    const purchasePrice = Number(property.price);
    const annualIncome = monthlyIncome * 12;
    const annualYield = (annualIncome / purchasePrice) * 100;
    const roiYears = purchasePrice / annualIncome;

    // Calculate mortgage payment if using calculator
    let mortgagePayment = 0;
    if (showCalculator) {
      const loanAmount =
        purchasePrice * (1 - calculatorValues.downPayment / 100);
      const monthlyRate = calculatorValues.interestRate / 100 / 12;
      const numberOfPayments = calculatorValues.loanTerm * 12;

      mortgagePayment =
        (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    // Calculate monthly cash flow
    const monthlyCashFlow = monthlyIncome - mortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash =
      (annualCashFlow /
        (purchasePrice * (calculatorValues.downPayment / 100))) *
      100;

    return {
      annualYield,
      roiYears,
      totalReturn: annualYield * 20, // Assume 20 years
      mortgagePayment,
      monthlyCashFlow,
      cashOnCash: isFinite(cashOnCash) ? cashOnCash : 0,
    };
  };

  const investmentMetrics = calculateROI();

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

  // ROI Chart component
  const RoiChart = ({ percentage }) => {
    return (
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="15"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="15"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-blue-600">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

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
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-lg">
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
            <TrendingUp className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Loading Investment Property
          </h3>

          <p className="text-gray-600 mb-6">
            We're retrieving details about this investment opportunity. Please
            wait a moment...
          </p>

          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 to-blue-400"
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
              className="w-2 h-2 bg-blue-500 rounded-full mr-2"
            />
            Loading investment metrics and property details...
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
              onClick={() => navigate("/invest")}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Investments
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
            onClick={() => navigate("/invest")}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <motion.div whileHover={{ x: -3 }} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Investments</span>
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
            <Building className="w-4 h-4 mr-1.5" />
            For {property.availability === "rent" ? "Rent" : "Sale"}
          </div>

          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Investment Property
          </div>

          <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm ml-auto">
            <Clock className="w-4 h-4 mr-1.5" />
            Listed {formatDate(property.createdAt)}
          </div>
        </motion.div>

        {/* Investment Highlight Banner */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-5 mb-8 text-white shadow-lg"
        >
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Premium Investment Opportunity
                </h2>
                <p className="text-white/90 text-sm">
                  Annual Return:{" "}
                  <span className="font-bold text-white">
                    {investmentMetrics.annualYield.toFixed(2)}x
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ₹{Number(investmentPrice).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-white/80">Monthly Income</div>
              </div>
              {/* <div className="text-center">
                <div className="text-2xl font-bold">
                  {investmentMetrics.roiYears.toFixed(1)}
                </div>
                <div className="text-xs text-white/80">ROI (Years)</div>
              </div> */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCalculator(true)}
                className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>ROI Calculator</span>
              </motion.button> */}
            </div>
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            {property.location}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Images and Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
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
                  <Maximize2 className="w-6 h-6" />
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
                          ? "border-blue-500"
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
                        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Features Grid */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                Property Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center border border-blue-100">
                  <BedDouble className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-lg font-semibold text-gray-800">
                    {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Comfortable Sleeping Areas
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center border border-blue-100">
                  <Bath className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-lg font-semibold text-gray-800">
                    {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
                  </p>
                  <p className="text-sm text-gray-500">Modern Bathrooms</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl text-center flex flex-col items-center justify-center border border-blue-100">
                  <Square className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-lg font-semibold text-gray-800">
                    {property.sqft} sqft
                  </p>
                  <p className="text-sm text-gray-500">Living Space</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Amenities & Facilities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="group-hover:text-blue-600 transition-colors">
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
                  <Compass className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold">Location</h2>
              </div>

              <p className="text-gray-700 mb-4 pl-12">{property.location}</p>

              {/* Map Placeholder - You would integrate Google Maps here */}
              <div className="relative h-64 bg-blue-50 rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-blue-100">
                <MapPin className="w-10 h-10 text-blue-500 absolute" />
                <div className="absolute inset-0 bg-blue-200/20"></div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  property.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 border border-blue-500 hover:border-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </motion.div>

          {/* Right Column - Investment details and contact */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${
              isSticky ? "lg:self-start lg:sticky lg:top-24" : ""
            } transition-all duration-300`}
          >
            {/* Investment Analysis Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Investment Analysis</h3>
                  <div className="px-2 py-1 rounded-full bg-white/20 text-xs font-medium">
                    Premium Opportunity
                  </div>
                </div>
                <div className="mt-2 flex items-baseline">
                  <IndianRupee className="w-6 h-6" />
                  <span className="text-3xl font-bold">
                    {Number(property.price).toLocaleString("en-IN")}
                  </span>
                  <span className="ml-2 text-sm opacity-80">
                    Purchase Price
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Key Investment Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <IndianRupee className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Monthly Income
                      </span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{Number(investmentPrice).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <Percent className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Annual Yield
                      </span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {investmentMetrics.annualYield.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* ROI Visualization */}
                {/* <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <PieChart className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        ROI Period
                      </span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {investmentMetrics.roiYears.toFixed(1)} years
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Time to recover investment
                    </p>
                  </div>

                  <RoiChart percentage={investmentMetrics.annualYield} />
                </div> */}

                {/* Investment Advantages */}
                {/* <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    Investment Advantages
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Strong rental demand in this location
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Higher than average yield of{" "}
                        {investmentMetrics.annualYield.toFixed(1)}%
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Potential for capital appreciation in this area
                      </span>
                    </li>
                  </ul>
                </div> */}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCalculator(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl 
                      hover:shadow-lg transition-all duration-300 flex items-center 
                      justify-center gap-2 font-medium"
                  >
                    <Calculator className="w-5 h-5" />
                    Investment Calculator
                  </motion.button> */}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSchedule(true)}
                    className="w-full bg-white border border-blue-200 text-blue-600 py-3 rounded-xl
                      hover:bg-blue-50 transition-all duration-300 flex items-center
                      justify-center gap-2 font-medium"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Viewing
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
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact Investment Advisor
              </h3>

              <div className="space-y-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {import.meta.env.VITE_CONTACT_NUMBER || "9999999999"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Call our investment specialist
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      investments@hybridrealty.com
                    </p>
                    <p className="text-xs text-gray-500">
                      Email our investment team
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${
                  import.meta.env.VITE_CONTACT_NUMBER || "9999999999"
                }`}
                className="w-full bg-blue-100 text-blue-700 py-3 rounded-xl hover:bg-blue-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            {/* Property Information Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-500" />
                Property Information
              </h3>

              <div className="space-y-4">
                {property.serialNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <Hash className="w-4 h-4 text-blue-500" />
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
                    <Home className="w-4 h-4 text-blue-500" />
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
                    <Square className="w-4 h-4 text-blue-500" />
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
                    <Calendar className="w-4 h-4 text-blue-500" />
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

        {/* Download Brochure CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border border-blue-100"
        >
          <div className="absolute right-0 top-0 transform translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
          <div className="absolute left-0 bottom-0 transform -translate-x-1/3 translate-y-1/3 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>

          <div className="relative z-10">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Investment Opportunity Details
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Download our detailed investment brochure with financial
              projections, market analysis, and expected returns for this
              property.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Investment Brochure
            </motion.button>
          </div>
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

        {/* Investment Calculator Modal */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                    Investment Calculator
                  </h3>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                      Mortgage Calculation
                    </h4>

                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Down Payment (%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={calculatorValues.downPayment}
                        onChange={(e) =>
                          setCalculatorValues({
                            ...calculatorValues,
                            downPayment: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10%</span>
                        <span>{calculatorValues.downPayment}%</span>
                        <span>90%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Interest Rate (%)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="15"
                        step="0.25"
                        value={calculatorValues.interestRate}
                        onChange={(e) =>
                          setCalculatorValues({
                            ...calculatorValues,
                            interestRate: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5%</span>
                        <span>{calculatorValues.interestRate}%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Loan Term (Years)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={calculatorValues.loanTerm}
                        onChange={(e) =>
                          setCalculatorValues({
                            ...calculatorValues,
                            loanTerm: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 yrs</span>
                        <span>{calculatorValues.loanTerm} yrs</span>
                        <span>30 yrs</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Purchase Price:
                          </span>
                          <span className="font-medium">
                            ₹{Number(property.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Down Payment:
                          </span>
                          <span className="font-medium">
                            ₹
                            {Math.round(
                              (Number(property.price) *
                                calculatorValues.downPayment) /
                                100
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Loan Amount:
                          </span>
                          <span className="font-medium">
                            ₹
                            {Math.round(
                              Number(property.price) *
                                (1 - calculatorValues.downPayment / 100)
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">
                      Investment Returns
                    </h4>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4 rounded-lg text-white">
                      <div className="text-center mb-4">
                        <div className="text-xs uppercase tracking-wider mb-1">
                          Monthly Mortgage Payment
                        </div>
                        <div className="text-2xl font-bold">
                          ₹
                          {Math.round(
                            investmentMetrics.mortgagePayment
                          ).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <div className="text-xs uppercase tracking-wider mb-1">
                            Monthly Income
                          </div>
                          <div className="text-xl font-bold">
                            ₹{Number(investmentPrice).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider mb-1">
                            Monthly Cash Flow
                          </div>
                          <div className="text-xl font-bold">
                            ₹
                            {Math.round(
                              investmentMetrics.monthlyCashFlow
                            ).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Annual Rental Yield:
                        </span>
                        <span className="font-medium text-blue-600">
                          {investmentMetrics.annualYield.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Cash-on-Cash Return:
                        </span>
                        <span className="font-medium text-blue-600">
                          {investmentMetrics.cashOnCash.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          ROI Duration:
                        </span>
                        <span className="font-medium text-blue-600">
                          {investmentMetrics.roiYears.toFixed(1)} years
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Estimated 20-Year Return:
                        </span>
                        <span className="font-medium text-blue-600">
                          {investmentMetrics.totalReturn.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                      >
                        <Download className="w-5 h-5" />
                        Download Full Analysis
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mt-2">
                    This is an estimation tool. Actual returns may vary.
                  </p>
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

export default InvestPropertyDetails;
