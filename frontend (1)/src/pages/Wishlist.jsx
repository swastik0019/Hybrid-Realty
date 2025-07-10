import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ChevronLeft, 
  Home, 
  Trash2,
  ExternalLink,
  Building,
  MapPin,
  Loader,
  AlertCircle,
  DollarSign,
  Bed,
  Bath,
  Square,
  Search
} from 'lucide-react';
import { Backendurl } from '../App';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {    
    fetchWishlistProperties();
  }, []);




  const handleViewDetails = (propertyId) => {
    navigate(`/properties/single/${propertyId}`);
  };

  // Update your fetchWishlistProperties function to handle the response properly:

const fetchWishlistProperties = async () => {
  try {
    setIsLoading(true);
    setError(null);

    
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      // toast.error('Authentication required');
      console.error('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Fetch wishlist properties
    const response = await axios.get(`${Backendurl}/api/users/me/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // If the response is an array of IDs, we need to fetch the property details
    if (Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] !== 'object') {
      // If we just have IDs, we need to fetch the actual property details
      const propertyPromises = response.data.map(propertyId => 
        axios.get(`${Backendurl}/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      const propertyResponses = await Promise.all(propertyPromises);
      const properties = propertyResponses.map(res => res.data);
      
      setWishlistProperties(properties);
    } else {
      // If we already have the property objects
      setWishlistProperties(response.data);
    }
    
    setIsLoading(false);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    
    // Handle different error scenarios
    if (err.response) {
      // Server responded with an error status
      if (err.response.status === 401) {
        // toast.error('Please log in to view your wishlist');
        console.error('Unauthorized access, redirecting to login');
        navigate('/login');
      } else {
        setError(`Error: ${err.response.data?.message || 'Failed to fetch wishlist'}`);
        // toast.error(`Error: ${err.response.data?.message || 'Failed to fetch wishlist'}`);
        console.error(`Error: ${err.response.data?.message || 'Failed to fetch wishlist'}`);
      }
    } else if (err.request) {
      // Request made but no response
      setError('Unable to connect to server. Please check your connection.');
      // toast.error('Unable to connect to server. Please check your connection.');
      console.error('Unable to connect to server. Please check your connection.');
    } else {
      setError('An unexpected error occurred');
      // toast.error('An unexpected error occurred');
      console.error('An unexpected error occurred:', err.message);
    }
    
    setIsLoading(false);
  }
};

  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${Backendurl}/api/users/toggle-wishlist`, 
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // toast.success('Property removed from wishlist');
      console.log('Property removed from wishlist');
      
      // Update the local state to reflect the removal
      setWishlistProperties(wishlistProperties.filter(p => p._id !== propertyId));
    } catch (err) {
      console.error('Error removing property from wishlist:', err);
      // toast.error('Failed to remove property from wishlist');
      console.error('Failed to remove property from wishlist');
    }
  };

  // Format price with rupee symbol
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price unavailable';
    
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  // Filter properties based on search term
  // Updated filter function to correctly search by serialNumber
const filteredProperties = wishlistProperties.filter(property => {
  if (!searchTerm) return true;
  
  const searchLower = searchTerm.toLowerCase();
  
  return (
    // Check if serialNumber exists and convert to string for comparison
    (property.serialNumber && property.serialNumber.toString().includes(searchTerm)) ||
    // Check title if it exists
    (property.title && property.title.toLowerCase().includes(searchLower)) ||
    // Check location if it exists
    (property.location && property.location.toLowerCase().includes(searchLower)) ||
    // Check type if it exists
    (property.type && property.type.toLowerCase().includes(searchLower))
  );
});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 text-[var(--theme-color-1)] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Wishlist</h3>
          <p className="text-gray-600">Please wait while we fetch your saved properties...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block mb-4"
          >
            <div className="p-3 bg-red-100 rounded-full shadow-sm">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          
          
          <Link 
            to="/properties" 
            className="mt-4 inline-flex items-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Browse more properties
          </Link>
        </motion.header>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your wishlist by property name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-color-1)]/30 focus:border-[var(--theme-color-1)] transition-all"
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Wishlist Properties */}
        {!isLoading && (
          <>
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-lg mx-auto">
                {searchTerm ? (
                  <>
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No matching properties</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any properties matching "{searchTerm}".
                    </p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
                    >
                      Clear search and show all
                    </button>
                  </>
                ) : (
                  <>
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't added any properties to your wishlist yet.
                    </p>
                    <Link
                      to="/properties"
                      className="bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center"
                    >
                      Browse Properties <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold text-[var(--theme-color-1)]">{filteredProperties.length}</span> saved {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </p>
                </div>
                

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              

          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property) => (
              <motion.div
                key={property._id || `property-${Math.random()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all relative group"
              >
                {/* Property Image */}
                <div className="relative h-52">
                  {property.image && property.image.length > 0 ? (
                    <img 
                      src={property.image[0]} 
                      alt={property.title || 'Property'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Property Type Badge */}
                  {property.type && (
                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {property.type}
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  {property.availability && (
                    <div className="absolute top-3 right-3 bg-[var(--theme-color-1)]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      For {property.availability}
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleRemoveFromWishlist(property._id)}
                      className="p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full shadow-md hover:text-red-500 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Property Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {property.title || 'Unnamed Property'}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{property.location || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-900 font-bold text-xl mb-4">
                    {formatPrice(property.price)}
                    
                    {/* Investment Indicator */}
                    {property.isForInvestment && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Investment
                      </span>
                    )}
                  </div>
                  
                  {/* Property Specs */}
                  <div className="flex justify-between text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.beds || 0} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.baths || 0} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.sqft || 0} sqft</span>
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <button 
                    onClick={()=>handleViewDetails(property._id)}
                    className="block w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] hover:shadow-md text-white text-center py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
              </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;