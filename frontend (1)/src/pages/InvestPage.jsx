import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid,
  List,
  TrendingUp,
  MapPin,
  Home,
  Search,
  Filter,
  Mail,
  ChevronDown,
  PieChart,
  DollarSign,
  BarChart4,
  Coins,
  Clock,
  Building,
  CheckCircle,
  Loader,
} from "lucide-react";
import SearchBar from "../components/properties/Searchbar.jsx";
import PropertyCard from "../components/properties/Propertycard.jsx";
import { Backendurl } from "../App.jsx";
import { NavLink } from "react-router";
import { Helmet } from "react-helmet-async";

const InvestPage = () => {
  const [viewState, setViewState] = useState({
    isGridView: true,
    showFilters: false,
  });

  const [propertyState, setPropertyState] = useState({
    properties: [],
    loading: true,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [statsData, setStatsData] = useState({
    totalProperties: 0,
    avgYield: 0,
    minInvestment: 0,
    maxInvestment: 0,
  });

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProperties = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(`${Backendurl}/api/products/list`);

      if (response.data.success) {
        // Filter for only approved and investment properties
        const investmentProperties = response.data.property.filter(
          (prop) =>
            prop.isApproved &&
            ((prop.invest && prop.invest !== "") || prop.isForInvestment) &&
            prop.lp === false
        );

        setPropertyState((prev) => ({
          ...prev,
          properties: investmentProperties,
          error: null,
          loading: false,
        }));

        // Calculate stats for the investment dashboard
        if (investmentProperties.length > 0) {
          const prices = investmentProperties.map((p) => Number(p.price));
          const yields = investmentProperties
            .map((p) => {
              const monthlyIncome = p.invest ? Number(p.invest) : 0;
              const purchasePrice = Number(p.price);
              return purchasePrice > 0
                ? ((monthlyIncome * 12) / purchasePrice) * 100
                : 0;
            })
            .filter((y) => y > 0);

          setStatsData({
            totalProperties: investmentProperties.length,
            avgYield:
              yields.length > 0
                ? (yields.reduce((a, b) => a + b, 0) / yields.length).toFixed(2)
                : 0,
            minInvestment: Math.min(...prices),
            maxInvestment: Math.max(...prices),
          });
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setPropertyState((prev) => ({
        ...prev,
        error: "Failed to fetch investment properties. Please try again later.",
        loading: false,
      }));
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Filter properties based on search query
  const filteredProperties = searchQuery
    ? propertyState.properties.filter((property) =>
        [property.title, property.description, property.location].some(
          (field) => field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : propertyState.properties;

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortBy) return 0;

    switch (sortBy) {
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "yield-desc":
        const yieldA = a.invest
          ? ((Number(a.invest) * 12) / Number(a.price)) * 100
          : 0;
        const yieldB = b.invest
          ? ((Number(b.invest) * 12) / Number(b.price)) * 100
          : 0;
        return yieldB - yieldA;
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

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

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, suffix, color }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white rounded-2xl p-5 shadow-md relative overflow-hidden border-b-4 ${color}`}
    >
      <div className="absolute right-0 top-0 opacity-10 p-2">
        <Icon size={60} />
      </div>
      <div className="flex items-center mb-2">
        <div
          className={`p-2 rounded-lg mr-3 ${
            color.replace("border-", "bg-").replace("border", "bg") + "/20"
          }`}
        >
          <Icon className={`w-5 h-5 ${color.replace("border-", "text-")}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase">
          {title}
        </h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {suffix && <span className="ml-1 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </motion.div>
  );

  if (propertyState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-[var(--theme-color-1)] animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading...</h3>
            {/* <p className="text-gray-600">Please wait while we fetch the latest opportunities...</p> */}
          </div>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white relative overflow-hidden pt-16">
        {bgPattern}

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
            onClick={fetchProperties}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (


    <>
      <Helmet>
      {/* Page Title */}
      <title>Real Estate Investment Opportunities | Hybrid Realty</title>
      
      {/* Meta Description */}
      <meta 
        name="description" 
        content="Explore premium real estate investment properties with high ROI potential. Discover diverse investment options, analyze property yields, and start your passive income journey with Hybrid Realty."
      />
      
      {/* Keywords */}
      <meta 
        name="keywords" 
        content="real estate investment, property investment, passive income, investment properties, real estate yields, ROI properties, property portfolio"
      />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content="Real Estate Investment Opportunities | Hybrid Realty" />
      <meta 
        property="og:description" 
        content="Explore premium real estate investment properties with high ROI potential. Discover diverse investment options, analyze property yields, and start your passive income journey with Hybrid Realty."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta 
        property="og:image" 
        content="/investment-og-image.jpg" 
      />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Real Estate Investment Opportunities | Hybrid Realty" />
      <meta 
        name="twitter:description" 
        content="Explore premium real estate investment properties with high ROI potential. Discover diverse investment options, analyze property yields, and start your passive income journey with Hybrid Realty."
      />
      <meta 
        name="twitter:image" 
        content="/investment-og-image.jpg" 
      />
    </Helmet>


    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Real Estate Investment Opportunities",
        "description": "A comprehensive platform for exploring and investing in high-potential real estate properties",
        "mainEntity": {
          "@type": "RealEstateInvestment",
          "name": "Hybrid Realty Investment Properties",
          "description": "Curated real estate investment opportunities with verified ROI potential",
          "offers": {
            "@type": "AggregateOffer",
            "description": "Diverse range of investment properties across different locations and property types",
            "highPrice": "10000000", // Highest property price
            "lowPrice": "500000",    // Lowest property price
            "priceCurrency": "INR"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/invest?query={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hybrid Realty",
          "url": window.location.origin,
          "logo": "/logo.jpg"
        }
      })}
    </script>
    
    
    
    
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
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block mb-4"
            >
              {/* <div className="p-3 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-md">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div> */}
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative">
              <span className="relative z-10">Invest</span>
              {/* <motion.span
                className="absolute bottom-1 left-0 right-0 h-3 bg-blue-200/40 -z-0 mx-auto w-64"
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              /> */}
            </h1>

            {/* <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Discover premium properties with excellent ROI potential and
              generate passive income through strategic real estate investments
            </motion.p> */}
          </motion.header>

          {/* Investment Dashboard */}
          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
          >
            <StatCard
              icon={Building}
              title="Available Properties"
              value={statsData.totalProperties}
              color="border-blue-500"
            />

            <StatCard
              icon={BarChart4}
              title="Average Annual Income"
              value={statsData.avgYield}
              suffix="%"
              color="border-green-500"
            />

            <StatCard
              icon={Coins}
              title="Min Investment"
              value={`₹${statsData.minInvestment.toLocaleString()}`}
              color="border-blue-500"
            />

            <StatCard
              icon={TrendingUp}
              title="Max Investment"
              value={`₹${statsData.maxInvestment.toLocaleString()}`}
              color="border-purple-500"
            />
          </motion.div> */}

          {/* Investment Strategy Banner */}

          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Why Invest in Real Estate?
                </h2>
                <p className="mb-4 max-w-2xl">
                  Real estate offers stable returns, tax advantages, and a hedge
                  against inflation. Our curated investment properties are
                  selected for their strong ROI potential.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Passive Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      Capital Appreciation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      Portfolio Diversification
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <PieChart className="w-5 h-5" />
                Investment Guide
              </motion.button>
            </div>
          </motion.div> */}

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
                  onSearch={(query) => setSearchQuery(query)}
                  className="flex-1"
                  placeholderText="Search investment properties..."
                />

                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 cursor-pointer shadow-sm focus:shadow-md w-48"
                    >
                      <option value="">Sort Properties</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="yield-desc">Highest Yield First</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <BarChart4 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </motion.div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setViewState((prev) => ({ ...prev, isGridView: true }))
                      }
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        viewState.isGridView
                          ? "bg-blue-100 text-blue-500"
                          : "hover:bg-blue-50 hover:text-blue-500"
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
                          ? "bg-blue-100 text-blue-500"
                          : "hover:bg-blue-50 hover:text-blue-500"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex items-center justify-between"
          >
            {/* <p className="text-gray-600">
              <span className="font-semibold text-blue-500">
                {sortedProperties.length}
              </span>{" "}
              investment{" "}
              {sortedProperties.length === 1 ? "property" : "properties"} found
            </p> */}

            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSearchQuery("")}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>



          {/* Properties Grid/List - UPDATED TO MATCH FeaturedInvestedProperties LAYOUT */}
          <motion.div
            layout
            className={`gap-4 md:gap-8 ${
              viewState.isGridView
                ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1"
            }`}
          >
            <AnimatePresence>
              {sortedProperties.length > 0 ? (
                sortedProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="h-full" // Ensures equal height cards
                  >
                    <PropertyCard
                      availability={property.availability}
                      property={property}
                      viewType={viewState.isGridView ? "grid" : "list"}
                      isInvestment={true}
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
                  <div className="p-4 mx-auto bg-blue-50 rounded-full inline-block mb-6">
                    <TrendingUp className="w-12 h-12 text-blue-500" />
                  </div>

                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {searchQuery
                      ? `We couldn't find any investment properties matching "${searchQuery}"`
                      : "Check back later for new investment opportunities"}
                  </p>

                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      <span>View All Properties</span>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Investors Call-to-Action */}
          {sortedProperties.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>

              <div className="relative z-10">
                <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Start Your Investment Journey?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Our team of investment advisors can help you understand the ROI
                  potential and guide you through the process.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    <NavLink to="/contact">Schedule a Consultation</NavLink>
                  </motion.button>

                  {/* <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-all duration-300 flex items-center"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Investment Calculator
                  </motion.button> */}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// X icon component
const X = ({ className }) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default InvestPage;
