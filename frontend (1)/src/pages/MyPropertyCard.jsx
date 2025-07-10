import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize,
  Share2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Hash
} from "lucide-react";
import PropTypes from "prop-types";

const MyPropertyCard = ({ 
  property, 
  viewType, 
  Backendurl, 
  currentImageIndex, 
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onImageNavigation,
  onNavigateToDetails,
  onShare,
  onEdit,
  onDelete,
  formatPrice
}) => {
  const isGrid = viewType === "grid";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`cursor-pointer group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full
        ${isGrid ? "flex flex-col" : "flex flex-col sm:flex-row gap-4 sm:gap-6"} 
        ${property.availability === "rent" 
          ? "bg-gradient-to-br from-blue-50 to-blue-100" 
          : "bg-gradient-to-br from-green-50 to-green-100"}`}
      onClick={() => onNavigateToDetails(property._id)}
      onMouseEnter={() => onMouseEnter(property._id)}
      onMouseLeave={() => onMouseLeave()}
    >
      {/* Image Carousel Section */}
      <div className={`relative overflow-hidden ${
        isGrid 
          ? "h-48 sm:h-56 md:h-64 w-full" 
          : "h-48 sm:h-40 md:h-48 w-full sm:w-64 md:w-80 lg:w-96 flex-shrink-0"
      }`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={`${property._id}-${currentImageIndex}`}
            src={property.image[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400?text=Image+Not+Found";
            }}
          />
        </AnimatePresence>

        {/* Image Navigation Controls */}
        {isHovered && property.image.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => onImageNavigation(e, property._id, "prev")}
              className="p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => onImageNavigation(e, property._id, "next")}
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

        {/* Property Tags */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg"
          >
            {property.type}
          </motion.span>
          
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              property.availability === "rent" 
                ? "bg-purple-600" 
                : "bg-green-600"
            } text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg`}
          >
            <span className="hidden sm:inline">
              {property.availability === "rent" ? "For Rent" : "For Sale"}
            </span>
            <span className="sm:hidden">
              {property.availability === "rent" ? "Rent" : "Sale"}
            </span>
          </motion.span>
          
          {/* Approval status badge */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              property.isApproved 
                ? "bg-green-500" 
                : "bg-yellow-500"
            } text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg`}
          >
            {property.isApproved ? "Approved" : "Pending"}
          </motion.span>
        </div>

        {/* Serial Number Badge */}
        {property.serialNumber && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Hash className="w-3 h-3 mr-1" />
            {property.serialNumber}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between ${
        isGrid ? "" : "sm:flex-col sm:justify-between"
      }`}>
        <div className="space-y-3 sm:space-y-4">
          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
            <span className="truncate">
              {isGrid && property.location.length > 25 
                ? `${property.location.substring(0, 25)}...` 
                : property.location}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors
            ${isGrid ? "text-base sm:text-lg md:text-xl" : "text-lg sm:text-xl"}`}>
            {isGrid && property.title.length > 30 
              ? `${property.title.substring(0, 30)}...` 
              : property.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            {formatPrice(property.price, {
              compact: true,
              iconClassName: "w-4 h-4 sm:w-5 sm:h-5 text-blue-600",
              priceClassName: `font-bold text-blue-600 ml-1 ${
                isGrid ? "text-lg sm:text-xl md:text-2xl" : "text-xl sm:text-2xl"
              }`,
            })}
          </div>
        </div>

        {/* Property Features - Responsive layout */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 ${
          isGrid ? "text-xs sm:text-sm" : "text-sm"
        }`}>
          <div className="flex flex-col items-center gap-1 bg-blue-50 p-1.5 sm:p-2 rounded-lg">
            <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-blue-50 p-1.5 sm:p-2 rounded-lg">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-blue-50 p-1.5 sm:p-2 rounded-lg">
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              {property.sqft} sqft
            </span>
          </div>
        </div>

        {/* Action Buttons - Responsive layout */}
        <div className="flex justify-between items-center mt-4 sm:mt-6">
          <button 
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 sm:p-2 rounded-full transition-colors"
            onClick={(e) => onShare(e, property)}
            title="Share Property"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex gap-1 sm:gap-2">
            <button 
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-1.5 sm:p-2 rounded-full transition-colors"
              onClick={(e) => onEdit(e, property._id)}
              title="Edit Property"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 sm:p-2 rounded-full transition-colors"
              onClick={(e) => onDelete(e, property._id)}
              title="Delete Property"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

MyPropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.array.isRequired,
    beds: PropTypes.number.isRequired,
    baths: PropTypes.number.isRequired,
    sqft: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    isApproved: PropTypes.bool,
    serialNumber: PropTypes.number
  }).isRequired,
  viewType: PropTypes.string.isRequired,
  Backendurl: PropTypes.string.isRequired,
  currentImageIndex: PropTypes.number.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onImageNavigation: PropTypes.func.isRequired,
  onNavigateToDetails: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired
};

export default MyPropertyCard;