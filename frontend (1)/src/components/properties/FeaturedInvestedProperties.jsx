import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  Eye,
  ArrowRight,
  Building,
  Search,
  TrendingUp,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { Backendurl } from '../App';
import PropTypes from "prop-types";
import { Backendurl } from "../../App";
import { toast } from "react-toastify";

const InvestmentPropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    } else {
      // Regular formatting with commas
      return amount.toLocaleString("en-IN");
    }
  };

  useEffect(() => {
    checkIfFavorite();
  }, [property._id]);

  const checkIfFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // toast.error('Please log in to add properties to your favorites');
        return;
      }

      // Make API call to check favorites
      const response = await axios.get(
        `${Backendurl}/api/users/check-favorite/${property._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set favorite status based on server response
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Error details:", {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });

        // Handle specific error scenarios
        if (error.response.status === 401) {
          // toast.error("Please log in again");
          console.error("Unauthorized access. Please log in again.");
        } else {
          // toast.error("Failed to check favorite status");
          console.error(
            "Failed to check favorite status:",
            error.response.data
          );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        // toast.error("Network error. Please check your connection.");
        console.error("Network error. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        // toast.error("An unexpected error occurred");
        console.error("An unexpected error occurred:", error.message);
      }

      // Ensure favorite state is reset
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent navigating to property details

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        // toast.error("Please log in to add properties to your favorites");
        console.error("Please log in to add properties to your favorites");
        return;
      }

      // Make API call to toggle favorite
      const response = await axios.post(
        `${Backendurl}/api/users/toggle-wishlist`,
        { propertyId: property._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state based on server response
        // setIsFavorite(response.data.isFavorite);

        setIsFavorite(!isFavorite);

        // console.log(response.data);
        // Provide user feedback
        if (response.data.isInWishlist) {
          // toast.success(`${property.title} added to favorites`);
          console.log(`${property.title} added to favorites`);
        } else {
          // toast.success(`${property.title} removed from favorites`);
          console.log(`${property.title} removed from favorites`);
        }
      } else {
        // toast.error(response.data.message || "Failed to update favorites");
        console.error("Failed to update favorites:", response.data.message);
      }
    } catch (error) {
      // More comprehensive error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Detailed error response:", {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });

        // Different error messages based on status code
        switch (error.response.status) {
          case 401:
            // toast.error("Unauthorized. Please log in again.");
            console.error("Unauthorized. Please log in again.");
            // Optionally: log out the user, redirect to login
            break;
          case 404:
            // toast.error("Property not found");
            console.error("Property not found");
            break;
          case 500:
            // toast.error("Server error. Please try again later.");
            console.error("Server error. Please try again later.");
            break;
          default:
            // toast.error(
            //   error.response.data.message ||
            //     "An unexpected error occurred while updating favorites"
            // );
            console.error(
              "An unexpected error occurred while updating favorites:",
              error.response.data.message
            );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        // toast.error(
        //   "No response from server. Please check your internet connection."
        // );
        console.error(
          "No response from server. Please check your internet connection."
        )
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        // toast.error("An unexpected error occurred");
        console.error("An unexpected error occurred:", error.message);
      }
    }
  };

  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };

  // Calculate ROI metrics
  const monthlyIncome = property.invest || property.monthlyRent || 0;
  const annualYield = (
    ((Number(monthlyIncome) * 12) / Number(property.price)) *
    100
  ).toFixed(2);
  const roiYears = (
    Number(property.price) /
    (Number(monthlyIncome) * 12)
  ).toFixed(1);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-48 md:h-64">
        <img
          src={property.image[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Property badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[var(--theme-color-1)] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md">
            {property.type}
          </span>

          {/* Investment Badge - Smaller on mobile */}
          <span className="bg-[var(--theme-investment-card-tag)] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Investment</span>
            <span className="sm:hidden">Inv</span>
          </span>

          {/* Serial Number - Only show on desktop */}
          {property.serialNumber && (
            <span className="hidden md:flex bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md items-center gap-1">
              <Hash className="w-2.5 h-2.5" />
              {property.serialNumber}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(e);
          }}
          className={`absolute top-2 right-2 p-1.5 md:p-2 rounded-full transition-all duration-300 z-[10]
            ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:text-red-500"
            }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

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
                className="px-5 py-3 bg-white text-blue-500 rounded-lg font-medium flex items-center gap-2 shadow-lg"
              >
                <Eye className="w-5 h-5" />
                View Investment
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property Content */}
      <div className="p-3 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
          {property.title.length > 25 ? `${property.title.substring(0, 25)}...` : property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3 md:mb-4">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
          <span className="line-clamp-1 text-sm">
            {property.location.length > 20 ? `${property.location.substring(0, 20)}...` : property.location}
          </span>
        </div>

        {/* Investment Highlight */}
        <div className="bg-green-50 p-2 md:p-3 rounded-lg mb-3 md:mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-green-700 font-medium">
                Monthly Income
              </p>
              <div className="flex items-center text-green-500 font-bold text-sm md:text-base">
                <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />
                <span>{formatPrice(monthlyIncome)}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-green-700 font-medium">
                Annual Return
              </p>
              <p className="font-bold text-green-500 text-sm md:text-base">{annualYield}%</p>
            </div>
          </div>
        </div>

        {/* Property Features - Hidden on mobile */}
        <div className="hidden md:flex justify-between items-center py-3 border-y border-gray-100 mb-4">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">{property.sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-[var(--theme-color-1)] font-bold">
            <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <span className="text-lg md:text-xl">{formatPrice(property.price)}</span>
          </div>

          {/* Investment tag - Hidden on mobile */}
          <div className="hidden md:flex text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Investment
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedInvestedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const categories = [
    { id: "all", label: "All Properties" },
    { id: "apartment", label: "Apartments" },
    { id: "villa", label: "Villas" },
    { id: "house", label: "Houses" },
    { id: "farmhouse", label: "farmhouse" },
    { id: "commercial properties", label: "commercial properties" },
    { id: "shops", label: "shops" },
    { id: "office spaces", label: "office spaces" },
    { id: "plots/lands", label: "plots/lands" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  useEffect(() => {
    const fetchInvestmentProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/products/list`);

        if (response.data.success) {
          // Filter only approved investment properties
          const investmentProperties = response.data.property
            .filter(
              (property) =>
                property.isApproved &&
                property.lp === false &&
                ((property.invest && property.invest !== "") ||
                  property.isForInvestment)
            )
            .slice(0, 6); // Take only first 6 properties for the featured section

          setProperties(investmentProperties);
        } else {
          setError("Failed to fetch investment properties");
          // Fallback to sample data
          // setProperties(sampleInvestmentProperties);
        }
      } catch (err) {
        console.error("Error fetching investment properties:", err);
        setError(
          "Failed to load investment properties. Using sample data instead."
        );
        // Fallback to sample data
        // setProperties(sampleInvestmentProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentProperties();
  }, []);

  const filteredProperties =
    activeCategory === "all"
      ? properties
      : properties.filter(
          (property) => property.type.toLowerCase() === activeCategory
        );

  const viewAllInvestments = () => {
    navigate("/investments");
  };

  if (loading) {
    return (
      <div className="py-20 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-blue-200/50 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-5 bg-blue-100/50 rounded w-1/4 mx-auto mb-16"></div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-white rounded-xl shadow h-96">
                      <div className="h-64 bg-blue-100/50 rounded-t-xl"></div>
                      <div className="p-6">
                        <div className="h-6 bg-blue-100/50 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-blue-100/30 rounded w-1/2 mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-6 bg-blue-100/40 rounded w-1/3"></div>
                          <div className="h-6 bg-blue-100/40 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow h-96">
                  <div className="h-64 bg-blue-100/50 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-6 bg-blue-100/50 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-blue-100/30 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-blue-100/40 rounded w-1/3"></div>
                      <div className="h-6 bg-blue-100/40 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
        >
          {/* <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Smart Investments</span> */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Invest
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium properties with excellent rental income potential and strong investment returns
          </p> */}
        </motion.div>

        {/* Category filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Desktop view - original buttons */}
          <div className="hidden md:flex flex-wrap gap-2 mt-5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
          ${
            activeCategory === category.id
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
          }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile view - dropdown menu with explicit ref name */}
          <div
            className="relative md:hidden flex justify-end w-full"
            ref={categoryDropdownRef}
          >
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-full font-medium text-sm shadow-md
        bg-blue-500 text-white border border-blue-500/20 
        transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <span>
                {categories.find((c) => c.id === activeCategory)?.label ||
                  "Select Category"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ease-in-out ${
                  mobileDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {mobileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 z-20 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                <div className="max-h-64 overflow-y-auto py-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setMobileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-all
                ${
                  activeCategory === category.id
                    ? "bg-gray-50 text-blue-500 font-medium border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-700 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8 max-w-md mx-auto text-center"
          >
            <p className="font-medium mb-1">Note: {error}</p>
            <p className="text-sm">
              Showing sample investment properties for demonstration.
            </p>
          </motion.div>
        )}

        {filteredProperties.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property._id} variants={itemVariants}>
                <InvestmentPropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <TrendingUp className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No investment properties available
            </h3>
            <p className="text-gray-600 mb-6">
              No investment properties found in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View All Investments
            </button>
          </div>
        )}

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={viewAllInvestments}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 font-medium"
          >
            Browse All Investment Properties
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          <p className="text-gray-600 mt-4 text-sm">
            Explore our complete collection of investment opportunities with
            attractive returns
          </p>
        </motion.div>
      </div>
    </section>
  );
};

InvestmentPropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default FeaturedInvestedProperties;
