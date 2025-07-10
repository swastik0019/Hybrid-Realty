import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Gift, 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  Users, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";
import AddPropertyLuckyDrawModal from "./AddPropertyLuckyDrawModal"; // Import the new component

const AdminLuckyDrawManagement = () => {
  const [luckyDrawProperties, setLuckyDrawProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  useEffect(() => {
    fetchLuckyDrawProperties();
  }, []);
  
  const fetchLuckyDrawProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/lucky-draw/properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log('responsee : ', response.data.properties);
      
      if (response.data.success) {
        setLuckyDrawProperties(response.data.properties);
        setError(null);
      } else {
        setError(response.data.message || "Failed to load lucky draw properties");
      }
    } catch (err) {
      console.error("Error fetching lucky draw properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFromLuckyDraw = async () => {
    if (!selectedProperty) return;
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(
        `${backendurl}/api/admin/lucky-draw/delete/${selectedProperty.property}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log('response : ',response);
      
      if (response.data.success) {
        // toast.success("Property removed from lucky draw successfully");
        console.log("Property removed from lucky draw successfully");
        setShowDeleteModal(false);
        setSelectedProperty(null);
        // Refetch the list
        fetchLuckyDrawProperties();
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
  
  const exportRegistrations = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/lucky-draw/export-registrations/${propertyId}`,
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
      link.setAttribute('download', `lucky-draw-registrations-${propertyId}.csv`);
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
  const getRegistrationStatus = (property) => {
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
  
  // Filter and search properties
  const filteredProperties = luckyDrawProperties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    const status = getRegistrationStatus(property);
    return matchesSearch && status === filterStatus;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mt-12 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lucky Draw Management</h1>
          <p className="text-gray-600">Create properties for lucky draw and manage registrations</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddPropertyModal(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Property to Lucky Draw
        </motion.button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg py-2 px-3 focus:border-amber-500 
                focus:ring-2 focus:ring-amber-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <button
            onClick={fetchLuckyDrawProperties}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 
              transition-colors flex items-center gap-2 text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading lucky draw properties...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchLuckyDrawProperties}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Gift className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{luckyDrawProperties.length}</h3>
                  <p className="text-sm text-gray-500">Total Lucky Draw Properties</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {luckyDrawProperties.filter(p => getRegistrationStatus(p) === "active").length}
                  </h3>
                  <p className="text-sm text-gray-500">Active Draws</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {luckyDrawProperties.filter(p => getRegistrationStatus(p) === "upcoming").length}
                  </h3>
                  <p className="text-sm text-gray-500">Upcoming Draws</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {luckyDrawProperties.reduce((sum, prop) => sum + (prop.registeredUsers || 0), 0)}
                  </h3>
                  <p className="text-sm text-gray-500">Total Registrations</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Properties Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => {
                      const status = getRegistrationStatus(property);
                      // console.log('property : ', property);
                      return (
                        <tr key={property._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-md object-cover" 
                                  src={property.image?.[0] || '/placeholder-property.jpg'} 
                                  alt={property.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                <div className="text-sm text-gray-500">{property.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(property.biddingStartDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              to {formatDate(property.biddingEndDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${status === 'active' ? 'bg-green-100 text-green-800' : 
                                status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}
                            >
                              {status === 'active' ? 'Active' : 
                                status === 'upcoming' ? 'Upcoming' : 'Closed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{property.registeredUsers || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => exportRegistrations(property._id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Export Registrations"
                                disabled={!property.registeredUsers}
                              >
                                <Download className={`w-5 h-5 ${!property.registeredUsers ? 'opacity-50 cursor-not-allowed' : ''}`} />
                              </button>
                              
                              <Link 
                                to={`/admin/lucky-draw/${property._id}`}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              
                              <button
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Remove from Lucky Draw"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        {searchTerm || filterStatus !== "all" 
                          ? "No properties match your search criteria" 
                          : "No lucky draw properties available. Add a property to get started."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Add Property Modal */}
      <AddPropertyLuckyDrawModal 
        showModal={showAddPropertyModal}
        setShowModal={setShowAddPropertyModal}
        onSuccess={fetchLuckyDrawProperties}
      />
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProperty && (
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
                  Are you sure you want to remove <span className="font-medium text-gray-900">{selectedProperty.title}</span> from the lucky draw?
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
    </div>
  );
};

export default AdminLuckyDrawManagement;