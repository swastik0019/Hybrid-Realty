import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Gift, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Trash2,
  BedDouble, 
  Bath, 
  Maximize, 
  IndianRupee,
  Loader,
  Trophy,
  User,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { backendurl } from "../App";
import { motion, AnimatePresence } from "framer-motion";

const LuckyDrawPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectingWinner, setSelectingWinner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerEmail, setWinnerEmail] = useState('');
  const [manualSelection, setManualSelection] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [winnerData, setWinnerData] = useState(null);
  const [loadingWinner, setLoadingWinner] = useState(false);


  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);
  
  // New function to fetch winner details
  const fetchWinnerDetails = async (winnerId) => {
    if (!winnerId) return;
    
    try {
      setLoadingWinner(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/users/${winnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log('response : ',response.data.name);
      
      if (response) {
        setWinnerData(response.data);
      } else {
        console.error("Failed to fetch winner details:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching winner details:", err);
    } finally {
      setLoadingWinner(false);
    }
  };
  
  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/lucky-draw/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setProperty(response.data.property);
        setError(null);
        
        // Check if there's already a winner
        if (response.data.property.winner) {
          setWinnerId(response.data.property.winner);
          // Fetch the winner's details
          fetchWinnerDetails(response.data.property.winner);
        }
      } else {
        setError(response.data.message || "Failed to load property details");
      }
    } catch (err) {
      console.error("Error fetching lucky draw property details:", err);
      setError("Failed to load property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFromLuckyDraw = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(
        `${backendurl}/api/admin/lucky-draw/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Property removed from lucky draw successfully");
        console.log("Property removed from lucky draw successfully");
        navigate("/admin/lucky-draw");
      } else {
        // toast.error(response.data.message || "Failed to remove property from lucky draw");
        console.error("Failed to remove property from lucky draw:", response.data.message);
      }
    } catch (err) {
      console.error("Error removing property from lucky draw:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to remove property from lucky draw. Please try again."
      // );
      console.error("Failed to remove property from lucky draw:", err.response?.data?.message);
    }
  };
  
  const handleSelectWinner = async () => {
    try {
      setSelectingWinner(true);
      const token = localStorage.getItem("token");
      
      let endpoint = `${backendurl}/api/admin/lucky-draw/select-winner/${property._id}`;
      let data = {};
      
      if (manualSelection && selectedWinnerId) {
        endpoint = `${backendurl}/api/admin/lucky-draw/select-manual-winner/${property._id}`;
        data = { userId: selectedWinnerId };
      } else if (winnerEmail) {
        endpoint = `${backendurl}/api/admin/lucky-draw/select-winner-by-email/${property._id}`;
        data = { email: winnerEmail };
      }
      
      const response = await axios.post(
        endpoint,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Winner selected successfully!");
        console.log("Winner selected successfully!");
        
        // Set the winner ID and fetch details
        if (response.data.winner) {
          setWinnerId(response.data.winner);
          fetchWinnerDetails(response.data.winner);
        }
        
        // Refresh the property details to update the UI
        fetchPropertyDetails();
        setShowWinnerModal(true);
      }
    } catch (err) {
      console.error("Error selecting winner:", err);
      // toast.error(err.response?.data?.message || "Failed to select winner");
      console.error("Failed to select winner:", err.response?.data?.message);
    } finally {
      setSelectingWinner(false);
    }
  };
  
  const exportRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/lucky-draw/export-registrations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lucky-draw-registrations-${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // toast.success("Registrations exported successfully");
      console.log("Registrations exported successfully");
    } catch (err) {
      console.error("Error exporting registrations:", err);
      // toast.error("Failed to export registrations");
      console.error("Failed to export registrations:", err);
    }
  };
  
  // Calculate registration status
  const getRegistrationStatus = () => {
    if (!property) return "";
    
    const today = new Date();
    const startDate = new Date(property.biddingStartDate);
    const endDate = new Date(property.biddingEndDate);
    
    if (today < startDate) {
      return "upcoming";
    } else if (today > endDate) {
      return "closed";
    } else {
      return "active";
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading property details...</h3>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg max-w-md">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-2 text-center">Error</h3>
          <p className="text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <Link
              to="/admin/lucky-draw"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!property) return null;
  
  const status = getRegistrationStatus();
  
  return (
    <div className="min-h-screen pt-16 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <Link
              to="/admin/lucky-draw"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Lucky Draw Management
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-500" />
              Lucky Draw Details
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            {property.registrations.length > 0 && (
              <button
                onClick={exportRegistrations}
                className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 
                  transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Registrations
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 
                transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove from Lucky Draw
            </button>
          </div>
        </div>
        

        {/* Winner Information Section - Updated */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-amber-500 mr-2" />
            Winner Information
          </h3>
          
          {property.status === 'completed' && winnerId ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Winner Selected</h4>
                  {/* <p className="text-sm text-green-600">
                    Selected on {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A'}
                  </p> */}
                </div>
              </div>
              
              {loadingWinner ? (
                <div className="flex justify-center py-4">
                  <Loader className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              ) : winnerData ? (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{winnerData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{winnerData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Verified</p>
                    <p className="font-medium">
                      {winnerData.isEmailVerified ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" /> Yes
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" /> No
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-xs truncate">{winnerId}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <p>Winner ID found ({winnerId}), but details could not be retrieved.</p>
                  </div>
                </div>
              )}
              
              {/* <div className="mt-4 flex gap-3">
                {winnerData && winnerData.email && (
                  <a 
                    href={`mailto:${winnerData.email}`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Winner
                  </a>
                )}
              </div> */}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
              {property.status === 'completed' ? (
                <p>No winner has been selected yet for this property.</p>
              ) : (
                <p>
                  Winner selection will be available after the bidding end date 
                  ({new Date(property.biddingEndDate).toLocaleDateString()}).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Registration Period</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(property.biddingStartDate)} - {formatDate(property.biddingEndDate)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center">
                  <span className={`
                    inline-flex h-2 w-2 rounded-full mr-2
                    ${status === 'active' ? 'bg-green-500' : 
                      status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'}
                  `}></span>
                  {status === 'active' ? 'Active' : 
                    status === 'upcoming' ? 'Upcoming' : 'Closed'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Registrations</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {property.registrations.length} {property.registrations.length === 1 ? 'User' : 'Users'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Trophy className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Winner Status</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {winnerId ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> Winner Selected
                    </span>
                  ) : (
                    <span className="text-gray-600">Not Selected Yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                
                <div className="flex flex-col md:flex-row mb-6">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <img 
                      src={property.image[0]} 
                      alt={property.title} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="md:w-2/3 md:pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {property.location}
                    </div>
                    
                    <div className="mb-3 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
                      <span className="text-xl font-bold text-gray-900">
                        {Number(property.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center">
                        <BedDouble className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {property.beds} {property.beds > 1 ? 'Beds' : 'Bed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {property.baths} {property.baths > 1 ? 'Baths' : 'Bath'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Maximize className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">{property.sqft} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  
                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Winner Selection Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 text-amber-500 mr-2" />
                Winner Selection
              </h2>
              
              {winnerId ? (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Winner already selected</p>
                  <p className="text-sm text-green-600 mt-1">
                    You can view the winner's details in the Winner Information section above.
                  </p>
                </div>
              ) : (
                status === 'closed' ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Registration is closed. You can now select a winner for this lucky draw.
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => {
                            setManualSelection(false);
                            setWinnerEmail('');
                            setSelectedWinnerId('');
                          }}
                          className={`px-4 py-2 rounded-lg text-white font-medium ${!manualSelection && !winnerEmail ? "bg-amber-500" : "bg-gray-400"}`}
                        >
                          Random Selection
                        </button>
                        <button
                          onClick={() => {
                            setManualSelection(true);
                            setWinnerEmail('');
                          }}
                          className={`px-4 py-2 rounded-lg text-white font-medium ${manualSelection && !winnerEmail ? "bg-amber-500" : "bg-gray-400"}`}
                        >
                          Manual Selection
                        </button>
                      </div>7078228624
                      
                      {/* Email input section */}
                      {!manualSelection && (
                        <div className="mt-4">
                          <label htmlFor="winnerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Winner Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            id="winnerEmail"
                            value={winnerEmail}
                            onChange={(e) => setWinnerEmail(e.target.value)}
                            placeholder="Enter email of the winner"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            If provided, the user with this email will be selected as the winner. Otherwise, a random winner will be selected.
                          </p>
                        </div>
                      )}
                      
                      {/* Manual selection dropdown */}
                      {manualSelection && property.registrations.length > 0 && (
                        <div className="mt-4">
                          <label htmlFor="selectedWinnerId" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Winner
                          </label>
                          <select
                            id="selectedWinnerId"
                            value={selectedWinnerId}
                            onChange={(e) => setSelectedWinnerId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value="">-- Select a user --</option>
                            {property.registrations.map((reg, index) => (
                              <option key={index} value={reg.user}>
                                {reg.user} {reg.phone ? `(${reg.phone})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {property.registrations.length > 0 ? (
                      <button
                        onClick={handleSelectWinner}
                        disabled={selectingWinner || (manualSelection && !selectedWinnerId)}
                        className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 
                          transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {selectingWinner ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin mr-2" />
                            Selecting...
                          </>
                        ) : (
                          <>
                            <Trophy className="w-4 h-4 mr-2" />
                            {manualSelection ? "Select This Winner" : winnerEmail ? "Select Winner by Email" : "Select Random Winner"}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                        No registrations available to select a winner.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-700 mb-2">
                      Winner selection will be available after the registration period ends on:
                    </p>
                    <div className="font-semibold text-blue-900">
                      {formatDate(property.biddingEndDate)}
                    </div>
                  </div>
                )
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  Registrations
                </h2>
                
                {property.registrations.length > 0 && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {property.registrations.length} total
                  </span>
                )}
              </div>
              
              {property.registrations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {property.registrations.slice(0, 5).map((registration, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                          {registration.user && registration.user.toString()}
                        </div>
                        <div className="text-xs text-gray-500">{registration.phone}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeAgo(registration.registeredAt)}
                    </div>
                  </div>
                ))}
                
                {property.registrations.length > 5 && (
                  <div className="pt-3 text-center">
                    <button
                      onClick={exportRegistrations}
                      className="text-blue-600 text-sm hover:text-blue-800"
                    >
                      View all {property.registrations.length} registrations
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No registrations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Confirm Removal
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove <span className="font-medium text-gray-900">{property.title}</span> from the lucky draw?
              </p>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                This will remove all lucky draw registrations associated with this property. This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveFromLuckyDraw}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove from Lucky Draw
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    
    {/* Winner Selection Result Modal */}
    <AnimatePresence>
      {showWinnerModal && winnerData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Winner Selected!</h3>
              <p className="text-gray-600">
                The winner for the lucky draw has been selected.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{winnerData.name}</div>
                  <div className="text-sm text-gray-500">Winner</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{winnerData.email}</span>
                </div>
                {winnerData.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{winnerData.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                  <span>Email {winnerData.isEmailVerified ? 'Verified' : 'Not Verified'}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowWinnerModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
);
};

export default LuckyDrawPropertyDetails;