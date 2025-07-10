import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Gift, AlertCircle, CheckCircle, ArrowLeft, Calendar, Clock, 
  Home, Phone, User, Award, Loader
} from 'lucide-react';

const UserLuckyDrawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [luckyDraw, setLuckyDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    phone: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        // Fetch lucky draw details
        const response = await axios.get(`/api/lucky-draw/${id}`);
        setLuckyDraw(response.data.luckyDraw);
        
        // If user is authenticated, check if they're registered
        if (token) {
          try {
            const userRegistrationsResponse = await axios.get('/api/user/lucky-draw/registrations', {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const isUserRegistered = userRegistrationsResponse.data.registrations.some(
              reg => reg._id === id
            );
            
            setIsRegistered(isUserRegistered);
          } catch (error) {
            console.error('Error checking registration status:', error);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lucky draw details:', err);
        setError(err.response?.data?.message || 'Failed to load lucky draw details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/lucky-draw/${id}`));
      return;
    }
    
    try {
      setRegistering(true);
      setError('');
      const token = localStorage.getItem('token');
      
      await axios.post(`/api/lucky-draw/${id}/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('Successfully registered for the lucky draw!');
      setIsRegistered(true);
      setRegistering(false);
    } catch (err) {
      console.error('Error registering for lucky draw:', err);
      setError(err.response?.data?.message || 'Failed to register for the lucky draw.');
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isRegistrationOpen = () => {
    if (!luckyDraw) return false;
    
    const now = new Date();
    const start = new Date(luckyDraw.biddingStartDate);
    const end = new Date(luckyDraw.biddingEndDate);
    
    return now >= start && now <= end;
  };

  const calculateTimeRemaining = () => {
    if (!luckyDraw) return '';
    
    const now = new Date();
    const end = new Date(luckyDraw.biddingEndDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Registration ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days} days, ${hours} hours, ${minutes} minutes remaining`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center py-20">
        <Loader className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading lucky draw details...</p>
      </div>
    );
  }

  if (error && !luckyDraw) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <button 
          onClick={() => navigate('/lucky-draw')}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lucky Draw List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/lucky-draw')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Lucky Draw Property</h1>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 relative">
              {luckyDraw.property?.image?.[0] ? (
                <img 
                  src={luckyDraw.property.image[0]} 
                  alt={luckyDraw.property.title}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                  <Gift className="h-16 w-16 text-amber-600" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 bg-amber-500 text-white text-sm rounded-md font-medium">
                  Lucky Draw
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{luckyDraw.property?.title}</h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <Home className="h-4 w-4 mr-2" />
                {luckyDraw.property?.location}
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-gray-900">${luckyDraw.property?.price?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Beds</p>
                  <p className="font-bold text-gray-900">{luckyDraw.property?.beds}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Baths</p>
                  <p className="font-bold text-gray-900">{luckyDraw.property?.baths}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="font-bold text-gray-900">{luckyDraw.property?.sqft} sqft</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h3>
              <p className="text-gray-700 mb-6">{luckyDraw.property?.description}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lucky Draw Details</h3>
              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">Registration Period:</p>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-1 text-amber-600" />
                    <span>Starts: {formatDate(luckyDraw.biddingStartDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-900 mt-1">
                    <Clock className="h-4 w-4 mr-1 text-red-600" />
                    <span>Ends: {formatDate(luckyDraw.biddingEndDate)}</span>
                  </div>
                </div>
                
                {isRegistrationOpen() ? (
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium">
                    Registration is currently open! {calculateTimeRemaining()}
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                    Registration is not currently open.
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How Lucky Draw Works</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Register for the lucky draw during the registration period</li>
                  <li>One winner will be randomly selected after the registration period ends</li>
                  <li>The winner will be notified via email and phone</li>
                  <li>The winner will have exclusive rights to purchase the property</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Gift className="h-5 w-5 mr-2 text-amber-600" />
              Register for Lucky Draw
            </h3>
            
            {isRegistered ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h4 className="text-center text-lg font-medium text-gray-900 mb-2">You're Registered!</h4>
                <p className="text-center text-gray-600 mb-4">
                  You have successfully registered for this lucky draw. Good luck!
                </p>
                <div className="text-center">
                  <Link 
                    to="/user/lucky-draw/registrations" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all your registrations →
                  </Link>
                </div>
              </div>
            ) : !isRegistrationOpen() ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                <h4 className="text-center text-lg font-medium text-gray-900 mb-2">
                  Registration {new Date() < new Date(luckyDraw.biddingStartDate) ? 'Not Yet Open' : 'Closed'}
                </h4>
                <p className="text-center text-gray-600">
                  {new Date() < new Date(luckyDraw.biddingStartDate) 
                    ? `Registration opens on ${formatDate(luckyDraw.biddingStartDate)}`
                    : `Registration closed on ${formatDate(luckyDraw.biddingEndDate)}`
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll contact you on this number if you win the lucky draw
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={registering}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                    registering ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {registering ? 'Registering...' : 'Register for Lucky Draw'}
                </button>
                
                {!isAuthenticated && (
                  <p className="text-sm text-gray-600 text-center">
                    You'll need to <Link to={`/login?redirect=/lucky-draw/${id}`} className="text-blue-600 hover:text-blue-800">login</Link> to register
                  </p>
                )}
              </form>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                to={`/property/${luckyDraw.property?._id}`}
                className="block text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Full Property Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLuckyDrawDetail;