import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize,
  Share2,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Hash,
  Heart,
} from "lucide-react";
import PropTypes from "prop-types";

const PropertyCard = ({ property, viewType, availability, isInvestment }) => {
  const isGrid = viewType === "grid";
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price with Indian currency formatting and compact notation
  const formatPrice = (price, options = {}) => {
    if (!price && price !== 0) return "—";

    const {
      iconClassName = "w-4 h-4 md:w-5 md:h-5 text-[var(--theme-color-1)]",
      priceClassName = "text-lg md:text-xl font-bold text-[var(--theme-color-1)] ml-1",
      compact = true,
      showLabel = false,
      labelText = "",
      labelClassName = "text-sm text-gray-600 ml-1",
      amber = false,
    } = options;

    const numericAmount = Number(price);
    if (isNaN(numericAmount)) return price;

    let formattedAmount;
    let label = "";

    if (compact && numericAmount >= 10000000) {
      formattedAmount = (numericAmount / 10000000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: numericAmount % 10000000 === 0 ? 0 : 1,
      });
      label = "Cr";
    } else if (compact && numericAmount >= 100000) {
      formattedAmount = (numericAmount / 100000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: numericAmount % 100000 === 0 ? 0 : 1,
      });
      label = "L";
    } else {
      formattedAmount = numericAmount.toLocaleString("en-IN");
    }

    const finalIconClassName = amber ? "w-3 h-3 md:w-4 md:h-4 text-amber-500" : iconClassName;
    const finalPriceClassName = amber
      ? "text-sm md:text-base font-bold text-amber-500 ml-1"
      : priceClassName;

    return (
      <div className="flex items-center">
        <IndianRupee className={finalIconClassName} />
        <span className={finalPriceClassName}>{formattedAmount}</span>
        {label && (
          <span className={finalPriceClassName + " ml-0.5"}>{label}</span>
        )}
        {showLabel && labelText && (
          <span className={labelClassName}>{labelText}</span>
        )}
      </div>
    );
  };

  const handleNavigateToDetails = () => {
    if (property.invest === "") {
      navigate(`/properties/single/${property._id}`);
    } else {
      navigate(`/invest/single/${property._id}`);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    const imagesCount = property.image.length;
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Add your favorite toggle logic here
  };

  // Check if property is for investment
  const isForInvestment =
    property.isForInvestment || (property.invest && property.invest !== "");
  const investmentPrice = property.monthlyRent || property.invest;

  // Calculate ROI metrics for investment properties
  const monthlyIncome = property.invest || property.monthlyRent || 0;
  const annualYield = isForInvestment && monthlyIncome > 0
    ? (((Number(monthlyIncome) * 12) / Number(property.price)) * 100).toFixed(2)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className={`cursor-pointer group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white shadow-md
        ${isGrid ? "flex flex-col h-full" : "flex flex-col sm:flex-row gap-4 sm:gap-6"}`}
      onClick={handleNavigateToDetails}
      onMouseEnter={() => {
        setShowControls(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setShowControls(false);
        setIsHovered(false);
      }}
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden ${
        isGrid 
          ? "h-48 md:h-64 w-full" 
          : "h-48 sm:h-40 md:h-48 w-full sm:w-64 md:w-80 flex-shrink-0"
      }`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.image[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Image Navigation Controls */}
        {showControls && property.image.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => handleImageNavigation(e, "prev")}
              className="p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => handleImageNavigation(e, "next")}
              className="p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </motion.button>
          </div>
        )}

        {/* Image Indicators */}
        {property.image.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.image.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${index === currentImageIndex ? "bg-white w-3" : "bg-white/60"}`}
              />
            ))}
          </div>
        )}

        {/* Property badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[var(--theme-color-1)] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md">
            {property.type}
          </span>

          <span className="bg-[var(--theme-rent-tag)] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md">
            {property.availability}
          </span>

          {/* Investment Badge */}
          {isForInvestment && (
            <span className="bg-[var(--theme-investment-card-tag)] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Investment</span>
              <span className="sm:hidden">Inv</span>
            </span>
          )}

          {/* Serial Number */}
          {property.serialNumber && (
            <span className="hidden md:flex bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md items-center gap-1">
              <Hash className="w-2.5 h-2.5" />
              {property.serialNumber}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className={`p-1.5 md:p-2 rounded-full transition-all duration-300 z-[10]
              ${isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:text-red-500"
              }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleShare}
            className="p-1.5 md:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-blue-50 
              transition-colors shadow-lg"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </motion.button>
        </div>

        {/* View overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-3 md:px-5 py-2 md:py-3 bg-white text-blue-500 rounded-lg font-medium flex items-center gap-2 shadow-lg text-sm md:text-base"
              >
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
                {isForInvestment ? "View Investment" : "View Details"}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-6 flex flex-col justify-between flex-1">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-500 transition-colors">
            {isGrid && property.title.length > 25 
              ? `${property.title.substring(0, 25)}...` 
              : property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1 text-xs md:text-sm">
              {isGrid && property.location.length > 20 
                ? `${property.location.substring(0, 20)}...` 
                : property.location}
            </span>
          </div>

          {/* Investment Highlight - Only for investment properties */}
          {isForInvestment && investmentPrice && (
            <div className="bg-green-50 p-2 md:p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    Monthly Income
                  </p>
                  <div className="flex items-center text-green-500 font-bold text-sm md:text-base">
                    <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{formatPrice(investmentPrice, { compact: true })}</span>
                  </div>
                </div>

                {annualYield > 0 && (
                  <div>
                    <p className="text-xs text-green-700 font-medium">
                      Annual Return
                    </p>
                    <p className="font-bold text-green-500 text-sm md:text-base">{annualYield}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Features - Hidden on mobile for grid view */}
          <div className={`${isGrid ? "hidden md:flex" : "flex"} justify-between items-center py-2 md:py-3 border-y border-gray-100`}>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span className="text-xs md:text-sm text-gray-600">
                {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span className="text-xs md:text-sm text-gray-600">
                {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span className="text-xs md:text-sm text-gray-600">{property.sqft} sqft</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            {formatPrice(property.price, {
              compact: true,
              iconClassName: "w-4 h-4 md:w-5 md:h-5 text-[var(--theme-color-1)]",
              priceClassName: "text-lg md:text-xl font-bold text-[var(--theme-color-1)] ml-1",
            })}
          </div>

          {/* Investment tag - Hidden on mobile for grid view */}
          {isForInvestment && (
            <div className={`${isGrid ? "hidden md:flex" : "flex"} text-xs md:text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md items-center`}>
              <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
              Investment
            </div>
          )}

          {/* Serial Number for grid view mobile */}
          {isGrid && property.serialNumber && (
            <div className="md:hidden bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium flex items-center">
              <Hash className="w-3 h-3 mr-1" />
              {property.serialNumber}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  viewType: PropTypes.string.isRequired,
  availability: PropTypes.string,
  isInvestment: PropTypes.bool,
};

export default PropertyCard;