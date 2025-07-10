import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  Building,
  MapPin,
  Maximize,
  Tag,
  Plus,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { useState } from "react";

const PropertyCard = ({ property }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="flex items-baseline">
          <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
          <span>{crores}</span>
          <span className="ml-1 text-sm font-medium text-gray-700">Cr</span>
        </div>
      );
    } else if (amount >= 100000) {
      // Format in lakhs (≥ 1 lakh)
      const lakhs = (amount / 100000).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: amount % 100000 === 0 ? 0 : 1,
      });
      return (
        <div className="flex items-baseline">
          <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
          <span>{lakhs}</span>
          <span className="ml-1 text-sm font-medium text-gray-700">L</span>
        </div>
      );
    } else {
      // Regular formatting with commas
      return (
        <div className="flex items-baseline">
          <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
          <span>{amount.toLocaleString("en-IN")}</span>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 flex flex-col h-full"
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[var(--theme-hover-color-1)] to-[var(--theme-hover-color-1)] p-4 sm:p-5 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-0 right-0 mt-3 mr-3 sm:mt-4 sm:mr-4"
        ></motion.div>

        <div className="relative z-10">
          <h3
            className="text-lg sm:text-xl font-semibold text-white mb-1 truncate"
            title={property.building_name}
          >
            {property.building_name}
          </h3>
          <div className="flex items-center text-blue-100 flex-wrap">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <p
              className="text-xs sm:text-sm truncate"
              title={property.location_address}
            >
              {property.location_address}
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Price and area information */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
              Price
            </p>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
          </div>

          {property.area_sqft && (
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                Area
              </p>
              <div className="flex items-center">
                <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 mr-1" />
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  {property.area_sqft}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Property description - Collapsible on mobile */}
        <div className="mb-4 sm:mb-5 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between text-left sm:pointer-events-none"
          >
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Building className="w-4 h-4 text-[var(--theme-hover-color-1)] mr-1.5" />
              Overview
            </h4>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden"
            >
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>

          <motion.div
            animate={{
              height: isExpanded ? "auto" : "3rem",
              opacity: 1,
            }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden ${
              isExpanded ? "" : "max-h-12 sm:max-h-none"
            }`}
          >
            <p
              className={`text-gray-600 text-xs sm:text-sm mt-2 ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {property.description}
            </p>
          </motion.div>
        </div>

        {/* Amenities section */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-hover-color-1)] mr-1.5" />
              Amenities
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {property.amenities
                .slice(0, isExpanded ? property.amenities.length : 2)
                .map((amenity, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-50 text-[var(--theme-hover-color-1)] text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-100"
                  >
                    {amenity}
                  </motion.span>
                ))}
              {!isExpanded && property.amenities.length > 2 && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(true)}
                  className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center border border-gray-100 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  {property.amenities.length - 2} more
                </motion.span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({ 
    building_name: PropTypes.string,
    location_address: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    property_type: PropTypes.string,
    area_sqft: PropTypes.string,
    description: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PropertyCard;
