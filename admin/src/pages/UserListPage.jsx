import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, User, Calendar, Mail, Heart, ArrowDown, ArrowUp, X } from 'lucide-react';
import { backendurl } from '../App';
import toast from 'react-hot-toast';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          // toast.error('Authentication required');
          console.error('No token found, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Important: Check the format of your authorization header
        // Some APIs expect just the token, others expect "Bearer token"
        const response = await axios.get(`${backendurl}/api/admin/users`, {
          headers: {
            Authorization: token // Try without "Bearer " prefix
          }
        });
        
        if (response.data) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        //   toast.success('Users loaded successfully');
        } else {
          // toast.error('Failed to load users data');
          console.error('No user data found in response');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        
        // Handle different error scenarios
        if (err.response) {
          // Server responded with an error status
          if (err.response.status === 401 || err.response.status === 403) {
            // toast.error('Not authorized to access user data. Please log in as admin.');
            console.error('Unauthorized access, redirecting to login');
            navigate('/login');
          } else {
            // toast.error(`Server error: ${err.response.data?.message || 'Failed to fetch users'}`);
            console.error(`Server error: ${err.response.status} - ${err.response.data?.message}`);
          }
        } else if (err.request) {
          // Request was made but no response received
          // toast.error('Unable to connect to server. Please check your connection.');
          console.error('No response received from server:', err.request);
        } else {
          // Something else happened in setting up the request
          // toast.error('Error setting up request');
          console.error('Error setting up request:', err.message);
        }
        
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          (user.name?.toLowerCase() || '').includes(lowerCaseQuery) || 
          (user.email?.toLowerCase() || '').includes(lowerCaseQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...filteredUsers].sort((a, b) => {
      if (field === 'name' || field === 'email') {
        const valueA = (a[field] || '').toLowerCase();
        const valueB = (b[field] || '').toLowerCase();
        return newDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (field === 'wishlist') {
        const wishlistLengthA = Array.isArray(a.wishlist) ? a.wishlist.length : 0;
        const wishlistLengthB = Array.isArray(b.wishlist) ? b.wishlist.length : 0;
        return newDirection === 'asc'
          ? wishlistLengthA - wishlistLengthB
          : wishlistLengthB - wishlistLengthA;
      } else if (field === 'createdAt') {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return newDirection === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Get wishlist count safely
  const getWishlistCount = (user) => {
    if (!user.wishlist) return 0;
    return Array.isArray(user.wishlist) ? user.wishlist.length : 0;
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 text-blue-600" /> 
      : <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-400 h-5 w-5" />
          </div>
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* User List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery 
                ? "No users found matching your search criteria." 
                : "No users found in the system."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      {renderSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('wishlist')}
                  >
                    <div className="flex items-center">
                      <span>Wishlist</span>
                      {renderSortIcon('wishlist')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <span>Created Date</span>
                      {renderSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {getUserInitials(user.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-400 mr-2" />
                        <div className="text-sm text-gray-500">
                          {getWishlistCount(user)} {getWishlistCount(user) === 1 ? 'property' : 'properties'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user._id);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserListPage;