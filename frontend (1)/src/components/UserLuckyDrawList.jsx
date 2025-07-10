import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Gift, Clock, Calendar, User, Home, AlertCircle, Loader } from 'lucide-react';
import { Backendurl } from '../App';

const UserLuckyDrawList = () => {
  const [luckyDraws, setLuckyDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRegistrations, setUserRegistrations] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        // Fetch active lucky draws
        const luckyDrawResponse = await axios.get(`${Backendurl}/api/lucky-draw`);
        setLuckyDraws(luckyDrawResponse.data.luckyDraws);
        
        // If user is authenticated, fetch their registrations
        if (token) {
          const registrationsResponse = await axios.get(`${Backendurl}/api/user/lucky-draw/registrations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Create a map of lucky draw IDs to easily check if user is registered
          const registrationMap = registrationsResponse.data.registrations.reduce((map, reg) => {
            map[reg._id] = reg;
            return map;
          }, {});
          
          setUserRegistrations(registrationMap);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load lucky draw properties. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} left`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  };

  const isUserRegistered = (luckyDrawId) => {
    return !!userRegistrations[luckyDrawId];
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center py-20">
        <Loader className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading lucky draw properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lucky Draw</h1>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {!loading && luckyDraws.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Gift className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Lucky Draw Properties</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no active lucky draw properties at the moment. Please check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {luckyDraws.map((luckyDraw) => (
            <div key={luckyDraw._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                {luckyDraw.property?.image?.[0] ? (
                  <img 
                    src={luckyDraw.property.image[0]} 
                    alt={luckyDraw.property.title}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                    <Gift className="h-12 w-12 text-amber-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-amber-500 text-white text-xs rounded-md font-medium">
                    Lucky Draw
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-bold truncate">{luckyDraw.property?.title}</h3>
                  <p className="text-white/80 text-sm flex items-center">
                    <Home className="h-3 w-3 mr-1" />
                    {luckyDraw.property?.location}
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold text-gray-900">
                    ${luckyDraw.property?.price.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    {calculateTimeRemaining(luckyDraw.biddingEndDate)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Beds</p>
                    <p className="font-medium">{luckyDraw.property?.beds}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Baths</p>
                    <p className="font-medium">{luckyDraw.property?.baths}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Sqft</p>
                    <p className="font-medium">{luckyDraw.property?.sqft}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm mb-1">Registration Period:</div>
                  <div className="text-sm flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1 text-amber-600" />
                    <span>{formatDate(luckyDraw.biddingStartDate)}</span>
                  </div>
                  <div className="text-sm flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1 text-red-600" />
                    <span>{formatDate(luckyDraw.biddingEndDate)}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  {isAuthenticated ? (
                    isUserRegistered(luckyDraw._id) ? (
                      <div className="w-full text-center py-2 bg-amber-100 text-amber-800 rounded-md font-medium">
                        Already Registered
                      </div>
                    ) : (
                      <Link 
                        to={`/lucky-draw/${luckyDraw._id}`}
                        className="w-full text-center py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition-colors"
                      >
                        Register Now
                      </Link>
                    )
                  ) : (
                    <Link 
                      to="/login?redirect=lucky-draw"
                      className="w-full text-center py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                    >
                      Login to Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isAuthenticated && (
        <div className="mt-10 p-6 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-amber-600" />
            Your Lucky Draw Registrations
          </h2>
          
          <Link 
            to="/user/lucky-draw/registrations" 
            className="text-amber-600 hover:text-amber-800 font-medium"
          >
            View your lucky draw registrations →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserLuckyDrawList;