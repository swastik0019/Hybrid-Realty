import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Tag, Users, Calendar, Loader, Search } from "lucide-react";
import LuckyDrawPropertyCard from "./LuckyDrawPropertyCard.jsx";
import { Backendurl } from "../App.jsx";
import { Helmet } from "react-helmet-async";

const LuckyDrawPage = () => {
  const [luckyDrawProperties, setLuckyDrawProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchLuckyDrawProperties = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Backendurl}/api/lucky-draw/properties`);
        
        // console.log('response : ',response);

        if (response.data.success) {
          setLuckyDrawProperties(response.data.properties);
          setError(null);
        } else {
          throw new Error(response.data.message);
        }
        // console.log('luckyDrawProperties : ', luckyDrawProperties);

      } catch (err) {
        console.error("Error fetching lucky draw properties:", err);
        setError("Failed to load lucky draw properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLuckyDrawProperties();
  }, []);
  
//   console.log('luckyDrawProperties : ', luckyDrawProperties);

  // Filter properties based on search query
  // const filteredProperties = luckyDrawProperties.filter((property) => 
  //   property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   property.location.toLowerCase().includes(searchQuery.toLowerCase())
  // );


  const filteredProperties = luckyDrawProperties.filter((property) => {
    const search = searchQuery ? searchQuery.toLowerCase() : ''; // Default to empty string if searchQuery is null or undefined
    return (property.title && property.title.toLowerCase().includes(search)) ||
           (property.location && property.location.toLowerCase().includes(search));
  });
  

//   console.log('filteredProperties : ', filteredProperties)
  
  if (loading) {
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
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md"
        >
          <p className="font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--theme-color-1)] text-white rounded-lg hover:bg-[var(--theme-hover-color-1)] transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (


    <>
      <Helmet>
      {/* Page Title */}
      <title>Lucky Draw Properties | Hybrid Realty - Win Your Dream Property</title>
      
      {/* Meta Description */}
      <meta 
        name="description" 
        content="Participate in Hybrid Realty's exclusive lucky draw and get a chance to win incredible properties. Browse our selection of lucky draw properties and register for your opportunity to win."
      />
      
      {/* Keywords */}
      <meta 
        name="keywords" 
        content="lucky draw properties, win a property, real estate lottery, property giveaway, property contest, real estate opportunity, win your dream home"
      />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content="Lucky Draw Properties | Hybrid Realty - Win Your Dream Property" />
      <meta 
        property="og:description" 
        content="Participate in Hybrid Realty's exclusive lucky draw and get a chance to win incredible properties. Browse our selection of lucky draw properties and register for your opportunity to win."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta 
        property="og:image" 
        content="/lucky-draw-og-image.jpg" 
      />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Lucky Draw Properties | Hybrid Realty - Win Your Dream Property" />
      <meta 
        name="twitter:description" 
        content="Participate in Hybrid Realty's exclusive lucky draw and get a chance to win incredible properties. Browse our selection of lucky draw properties and register for your opportunity to win."
      />
      <meta 
        name="twitter:image" 
        content="/lucky-draw-og-image.jpg" 
      />
    </Helmet>

    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Lucky Draw Real Estate Properties",
        "description": "Exclusive opportunity to win premium real estate properties through a lucky draw",
        "mainEntity": {
          "@type": "CollectionPage",
          "name": "Property Lucky Draw Listings",
          "description": "Browse and participate in property lucky draw opportunities",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/lucky-draw?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hybrid Realty",
          "url": window.location.origin,
          "logo": "/logo.jpg"
        },
        "offer": {
          "@type": "Offer",
          "description": "Chance to win real estate properties through lucky draw",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "INR",
          "eligibilityRegion": "IN"
        }
      })}
    </script>
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          {/* <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Limited Time Opportunity
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lucky Draw
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Register for a chance to be selected for exclusive property opportunities
          </p> */}
        </motion.header>

        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{luckyDrawProperties.length}</h3>
              <p className="text-gray-600">Active Lucky Draw Properties</p>
            </div>
          </div>
          
          {/* <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {luckyDrawProperties.reduce((total, property) => total + (property.registeredUsers || 0), 0)}
              </h3>
              <p className="text-gray-600">Total Registrations</p>
            </div>
          </div> */}
          
          {/* <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {luckyDrawProperties.filter(property => 
                  new Date(property.biddingEndDate) > new Date()
                ).length}
              </h3>
              <p className="text-gray-600">Draws Closing Son</p>
            </div>
          </div> */}
        </div>
        
        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <LuckyDrawPropertyCard key={property._id} property={property} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lucky draw properties found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No properties match "${searchQuery}"`
                    : "There are currently no lucky draw properties available"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default LuckyDrawPage;