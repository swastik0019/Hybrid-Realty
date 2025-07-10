import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gift, Clock, Calendar, Award, ArrowLeft, AlertCircle, 
  Loader, CheckCircle, XCircle
} from 'lucide-react';

const UserLuckyDrawRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login?redirect=/user/lucky-draw/registrations');
          return;
        }
        
        const response = await axios.get('/api/user/lucky-draw/registrations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRegistrations(response.data.registrations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError(err.response?.data?.message || 'Failed to load your registrations.');
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status, isWinner) => {
    if (isWinner) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 flex items-center w-fit">
          <Award className="h-3 w-3 mr-1" />
          Winner
        </span>
      );
    }
    
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center py-20">
        <Loader className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your registrations...</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Your Lucky Draw Registrations</h1>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {!loading && registrations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Registrations Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't registered for any lucky draws yet. Browse our available lucky draw properties to participate.
          </p>
          <Link 
            to="/lucky-draw"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <Gift className="h-5 w-5 mr-2" />
            Browse Lucky Draw Properties
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Draw Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration._id} className={registration.isWinner ? 'bg-amber-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {registration.property?.image?.[0] ? (
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={registration.property.image[0]} 
                              alt={registration.property.title} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center">
                              <Gift className="h-6 w-6 text-amber-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{registration.property?.title || "Unknown Property"}</div>
                          <div className="text-sm text-gray-500">${registration.property?.price?.toLocaleString() || "Unknown Price"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(registration.registeredAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-amber-500" />
                          {formatDate(registration.biddingStartDate)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-red-500" />
                          {formatDate(registration.biddingEndDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(registration.status, registration.isWinner)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/lucky-draw/${registration._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Lucky Draw Properties</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Gift className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">What are Lucky Draw Properties?</h3>
              <p className="text-sm text-gray-600">Lucky Draw Properties are exclusive listings where one lucky participant gets the chance to purchase the property.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">How do I win?</h3>
              <p className="text-sm text-gray-600">Register during the registration period. After the registration closes, a winner will be randomly selected from all participants.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">If I win?</h3>
              <p className="text-sm text-gray-600">If you're selected as a winner, you'll be notified via email and phone. You'll have exclusive rights to purchase the property.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">If I don't win?</h3>
              <p className="text-sm text-gray-600">If you're not selected, you can still participate in other lucky draws. Keep checking for new opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLuckyDrawRegistrations;