import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid,
  List,
  SlidersHorizontal,
  MapPin,
  Home,
  Hash,
  Search,
  ArrowDownAZ,
  Filter,
  Sparkles,
  ChevronsDown,
  Loader,
  Zap,
  Tag,
  X,
  Flame
} from "lucide-react";
import SearchBar from "../components/properties/Searchbar.jsx";
import FilterSection from "../components/properties/Filtersection.jsx";
import PropertyCard from "../components/properties/Propertycard.jsx";
import { Backendurl } from "../App.jsx";

const HotDealsPage = () => {
  const [viewState, setViewState] = useState({
    isGridView: true,
    showFilters: false,
    showMap: false,
  });

  const [propertyState, setPropertyState] = useState({
    properties: [],
    loading: true,
    error: null,
    selectedProperty: null,
  });

  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    bedrooms: "0",
    bathrooms: "0",
    availability: "",
    searchQuery: "",
    sortBy: "",
    investment: "",
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to create sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.propertyType) count++;
    if (
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < Number.MAX_SAFE_INTEGER
    )
      count++;
    if (filters.bedrooms !== "0") count++;
    if (filters.bathrooms !== "0") count++;
    if (filters.availability) count++;
    if (filters.investment) count++;
    if (filters.searchQuery) count++;

    setActiveFiltersCount(count);
  }, [filters]);

  const fetchHotDeals = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(`${Backendurl}/api/products/list`);

      if (response.data.success) {
        // Filter only for hot deals properties that are approved
        const hotDeals = response.data.property.filter(
          (prop) => prop.isApproved && prop.isHotDeal === true
        );

        setPropertyState((prev) => ({
          ...prev,
          properties: hotDeals,
          error: null,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setPropertyState((prev) => ({
        ...prev,
        error: "Failed to fetch hot deals. Please try again later.",
        loading: false,
      }));
      console.error("Error fetching hot deals:", err);
    }
  };

  useEffect(() => {
    fetchHotDeals();
  }, []);

  const filteredProperties = useMemo(() => {
    return propertyState.properties
      .filter((property) => {
        // Check if search is potentially for a serial number
        const isNumericSearch =
          !isNaN(filters.searchQuery) && filters.searchQuery.trim() !== "";

        // If numeric search and serial number matches exactly, prioritize it
        if (isNumericSearch && property.serialNumber !== undefined) {
          if (property.serialNumber.toString() === filters.searchQuery.trim()) {
            return true;
          }
        }

        const searchMatch =
          !filters.searchQuery ||
          [
            property.title,
            property.description,
            property.location,
            property.serialNumber?.toString() || "",
          ].some((field) =>
            field?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );

        const typeMatch =
          !filters.propertyType ||
          property.type?.toLowerCase() === filters.propertyType.toLowerCase();

        const priceMatch =
          property.price >= filters.priceRange[0] &&
          property.price <= filters.priceRange[1];

        const bedroomsMatch =
          !filters.bedrooms ||
          filters.bedrooms === "0" ||
          property.beds >= parseInt(filters.bedrooms);

        const bathroomsMatch =
          !filters.bathrooms ||
          filters.bathrooms === "0" ||
          property.baths >= parseInt(filters.bathrooms);

        const availabilityMatch =
          !filters.availability ||
          property.availability?.toLowerCase() ===
            filters.availability.toLowerCase();

        const investmentMatch =
          !filters.investment ||
          (filters.investment === "yes"
            ? (property.invest && property.invest !== "") ||
              property.isForInvestment
            : filters.investment === "no"
            ? (!property.invest || property.invest === "") &&
              !property.isForInvestment
            : true);

        return (
          searchMatch &&
          typeMatch &&
          priceMatch &&
          bedroomsMatch &&
          bathroomsMatch &&
          availabilityMatch &&
          investmentMatch
        );
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "newest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case "serial":
            return (a.serialNumber || 0) - (b.serialNumber || 0);
          default:
            return 0;
        }
      });
  }, [propertyState.properties, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      propertyType: "",
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      bedrooms: "0",
      bathrooms: "0",
      availability: "",
      searchQuery: "",
      sortBy: "",
      investment: "",
    });
  };

  // Check if we have an exact serial number match
  const exactSerialMatch = useMemo(() => {
    const isNumericSearch =
      !isNaN(filters.searchQuery) && filters.searchQuery.trim() !== "";
    if (isNumericSearch && filteredProperties.length === 1) {
      return (
        filteredProperties[0].serialNumber?.toString() ===
        filters.searchQuery.trim()
      );
    }
    return false;
  }, [filteredProperties, filters.searchQuery]);

  if (propertyState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Hot Deals...</h3>
          </div>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        {/* Background pattern */}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md relative z-10 border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h3>
          <p className="text-gray-600 mb-6">{propertyState.error}</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchHotDeals}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-16 pb-20 relative overflow-hidden"
    >
      {/* Background pattern */}
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

      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
            {/* <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block mb-4"
            >
              <div className="p-3 bg-gradient-to-br from-orange-100 to-white rounded-xl shadow-md">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div> */}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-10 relative">
            <span className="relative z-10">Hot Deals & Special Offers</span>
            <motion.span
              className="absolute bottom-1 left-0 right-0 h-3 bg-orange-200/40 -z-0 mx-auto w-72"
              initial={{ width: 0 }}
              animate={{ width: "18rem" }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </h1>

          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center mt-6"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-orange-500"
            >
              <ChevronsDown className="h-6 w-6" />
            </motion.div>
          </motion.div> */}
        </motion.header>

        {/* Fixed controls on scroll */}
        <motion.div
          className={`sticky top-16 z-20 py-3 backdrop-blur-md transition-all duration-300 -mx-4 px-4 ${
            scrolled ? "bg-white/80 shadow-md" : "bg-transparent"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <SearchBar
                onSearch={(query) =>
                  setFilters((prev) => ({ ...prev, searchQuery: query }))
                }
                className="flex-1"
                placeholderText="Search hot deals..."
              />

              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 cursor-pointer shadow-sm focus:shadow-md w-44"
                  >
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="serial">Property ID</option>
                  </select>
                  <ArrowDownAZ className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </motion.div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setViewState((prev) => ({
                        ...prev,
                        showFilters: !prev.showFilters,
                      }))
                    }
                    className={`p-2.5 rounded-lg hover:bg-orange-50 transition-all duration-200 relative ${
                      viewState.showFilters
                        ? "bg-orange-100 text-orange-500"
                        : "hover:text-orange-500"
                    }`}
                    title="Toggle Filters"
                  >
                    <Filter className="w-5 h-5" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setViewState((prev) => ({ ...prev, isGridView: true }))
                    }
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      viewState.isGridView
                        ? "bg-orange-100 text-orange-500"
                        : "hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setViewState((prev) => ({ ...prev, isGridView: false }))
                    }
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      !viewState.isGridView
                        ? "bg-orange-100 text-orange-500"
                        : "hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2"
              >
                <span className="text-xs text-gray-500 mr-1">
                  Active filters:
                </span>

                {filters.searchQuery && (
                  <div className="bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs flex items-center">
                    <Search className="w-3 h-3 mr-1" />
                    <span className="mr-1">"{filters.searchQuery}"</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, searchQuery: "" }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.propertyType && (
                  <div className="bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs flex items-center">
                    <Home className="w-3 h-3 mr-1" />
                    <span className="mr-1">Type: {filters.propertyType}</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, propertyType: "" }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < Number.MAX_SAFE_INTEGER) && (
                  <div className="bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    <span className="mr-1">
                      Price: ₹{filters.priceRange[0].toLocaleString()} - ₹
                      {filters.priceRange[1] === Number.MAX_SAFE_INTEGER
                        ? "Any"
                        : filters.priceRange[1].toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [0, Number.MAX_SAFE_INTEGER],
                        }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto transition-colors flex items-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {viewState.showFilters && (
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-1"
              >
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleFilterChange}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          <div
            className={`${
              viewState.showFilters ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            {/* Hot Deals Banner */}
            {/* <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 p-4 md:p-6 rounded-xl mb-6 text-white shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold">Limited-Time Hot Deals</h2>
                  <p className="text-white/80 mt-1">
                    Act fast! These special offers won't last long
                  </p>
                </div>
              </div>
            </motion.div> */}

            {/* Results count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex items-center justify-between"
            >
              <p className="text-gray-600">
                <span className="font-semibold text-orange-500">
                  {filteredProperties.length}
                </span>{" "}
                {filteredProperties.length === 1 ? "hot deal" : "hot deals"}{" "}
                available
              </p>

              {activeFiltersCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={clearAllFilters}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Reset All Filters
                </motion.button>
              )}
            </motion.div>

            <motion.div
              layout
              className={`grid gap-6 ${
                viewState.isGridView
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <PropertyCard
                        availability={property.availability}
                        property={{...property, isHotDeal: true}} // Ensure hot deal flag is set
                        viewType={viewState.isGridView ? "grid" : "list"}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="col-span-full text-center py-16 bg-white rounded-xl shadow-md border border-gray-100"
                  >
                    <div className="p-4 mx-auto bg-gray-50 rounded-full inline-block mb-6">
                      <Flame className="w-12 h-12 text-gray-400" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      No hot deals found
                    </h3>

                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      {!isNaN(filters.searchQuery) &&
                      filters.searchQuery.trim() !== ""
                        ? `No hot deal found with ID #${filters.searchQuery}`
                        : "We couldn't find any hot deals matching your current filters. Try adjusting your search criteria or check back later for new offers."}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span>View All Hot Deals</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotDealsPage;