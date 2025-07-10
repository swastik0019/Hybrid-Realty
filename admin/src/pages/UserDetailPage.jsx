import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Heart, 
  ChevronLeft, 
  Home, 
  AlertCircle,
  Trash2,
  ExternalLink,
  Clock
} from 'lucide-react';
import { backendurl } from '../App';
import toast from 'react-hot-toast';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          // toast.error('Authentication required');
          console.error('No token found');
          navigate('/login');
          return;
        }
        
        // Fetch user data from admin endpoint
        const userResponse = await axios.get(`${backendurl}/api/admin/users/${userId}`, {
          headers: {
            Authorization: token
          }
        });
        
        setUser(userResponse.data);
        
        // Fetch wishlist properties if user has any
        if (userResponse.data.wishlist && userResponse.data.wishlist.length > 0) {
          const propertiesResponse = await axios.get(`${backendurl}/api/admin/users/${userId}/wishlist`, {
            headers: {
              Authorization: token
            }
          });
          setWishlistProperties(propertiesResponse.data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        
        // Handle different error scenarios
        if (err.response) {
          // Server responded with an error status
          if (err.response.status === 401 || err.response.status === 403) {
            // toast.error('Not authorized to access user data');
            console.error('Not authorized to access user data');
            navigate('/login');
          } else if (err.response.status === 404) {
            // toast.error('User not found');
            console.error('User not found');
            navigate('/admin/users');
          } else {
            // toast.error(`Server error: ${err.response.data?.message || 'Failed to fetch user details'}`);
            console.error(`Server error: ${err.response.data?.message || 'Failed to fetch user details'}`);
          }
        } else if (err.request) {
          // Request was made but no response received
          // toast.error('Unable to connect to server. Please check your connection.');
          console.error('Unable to connect to server. Please check your connection.');
        } else {
          // Something else happened in setting up the request
          // toast.error('Error setting up request');
          console.error('Error setting up request:', err.message);
        }
        
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserAndWishlist();
    }
  }, [userId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format price with commas and currency symbol
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price unavailable';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle removing property from wishlist
  const handleRemoveFromWishlist = async (propertyId) => {
    if (!window.confirm('Are you sure you want to remove this property from the user\'s wishlist?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${backendurl}/api/admin/users/${userId}/wishlist/${propertyId}`, {
        headers: {
          Authorization: token
        }
      });
      
      // toast.success('Property removed from wishlist');
      console.log('Property removed from wishlist');
      
      // Update the local state to reflect the removal
      setWishlistProperties(wishlistProperties.filter(p => p._id !== propertyId));
      
      // Update the user object's wishlist array
      if (user && user.wishlist) {
        setUser({
          ...user,
          wishlist: user.wishlist.filter(id => id !== propertyId)
        });
      }
    } catch (err) {
      console.error('Error removing property from wishlist:', err);
      // toast.error('Failed to remove property from wishlist');
      console.error('Failed to remove property from wishlist');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${backendurl}/api/admin/users/${userId}`, {
        headers: {
          Authorization: token
        }
      });
      
      // toast.success('User deleted successfully');
      console.log('User deleted successfully');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      // toast.error('Failed to delete user');
      console.error('Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
          <AlertCircle className="inline-block mr-2" />
          User not found.
        </div>
        <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ChevronLeft className="mr-1" /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">
                Users
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{user.name || 'User Details'}</span>
            </div>
          </li>
        </ol>
      </nav>
      
      {/* User Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                {getUserInitials(user.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name || 'Unnamed User'}</h2>
                <div className="flex items-center text-gray-500">
                  <Mail className="mr-1 h-4 w-4" />
                  <span>{user.email || 'No email'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                to="/admin/users" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Users
              </Link>
              
              <button 
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete User
              </button>
            </div>
          </div>
        </div>
        
        {/* User Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-sm break-all">{user._id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p>{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                
                {user.resetToken && (
                  <div>
                    <p className="text-sm text-gray-500">Password Reset Token</p>
                    <p className="font-mono text-sm break-all">{user.resetToken}</p>
                  </div>
                )}
                
                {user.resetTokenExpire && (
                  <div>
                    <p className="text-sm text-gray-500">Token Expires</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <p>{formatDate(user.resetTokenExpire)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Wishlist Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Total Properties</p>
                  <p className="flex items-center">
                    <Heart className="text-red-500 mr-2 h-5 w-5" /> 
                    <span className="text-2xl font-bold">
                      {user.wishlist ? user.wishlist.length : 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wishlist Title */}
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="text-red-500 mr-2 h-5 w-5" />
              User's Wishlist
            </h3>
          </div>
          
          {/* Wishlist Properties */}
          {!user.wishlist || user.wishlist.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">This user hasn't added any properties to their wishlist yet.</p>
            </div>
          ) : wishlistProperties.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading wishlist properties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProperties.map((property) => (
                <div key={property._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    {property.imageUrl ? (
                      <img 
                        src={property.imageUrl} 
                        alt={property.title || 'Property'} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleRemoveFromWishlist(property._id)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    
                    {property.type && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                        {property.type}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 truncate">
                      {property.title || 'Unnamed Property'}
                    </h3>
                    
                    <p className="text-gray-500 text-sm mb-3 truncate">
                      {property.address || 'No address provided'}
                    </p>
                    
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-blue-600 text-lg">
                        {formatPrice(property.price)}
                      </p>
                      
                      {property.status && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                          {property.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium">{property.bedrooms || 0}</span>
                        <span className="mx-1">Bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{property.bathrooms || 0}</span>
                        <span className="mx-1">Bath{property.bathrooms !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{property.area || 0}</span>
                        <span className="ml-1">sq ft</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4">
                    <Link 
                      to={`/property/${property._id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex items-center justify-center transition-colors"
                    >
                      View Property <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetailPage;