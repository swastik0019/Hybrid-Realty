import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Building, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Trash2,
  User,
  Mail,
  Phone,
  AlertTriangle,
  Loader,
  Edit,
  Tag,
  MessageSquare,
  DollarSign,
  Home
} from "lucide-react";
import { backendurl } from "../App";
import { motion, AnimatePresence } from "framer-motion";

const UpcomingProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    fetchProjectDetails();
  }, [id]);
  
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/upcoming-projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setProject(response.data.project);
        setError(null);
      } else {
        setError(response.data.message || "Failed to load project details");
      }
    } catch (err) {
      console.error("Error fetching upcoming project details:", err);
      setError("Failed to load project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(
        `${backendurl}/api/admin/upcoming-projects/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Project deleted successfully");
        console.log("Project deleted successfully");
        navigate("/admin/upcoming-projects");
      } else {
        // toast.error(response.data.message || "Failed to delete project");
        console.error("Failed to delete project:", response.data.message);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to delete project. Please try again."
      // );
      console.error("Failed to delete project:", err.response?.data?.message);
    }
  };
  
  const exportRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/upcoming-projects/export-registrations/${id}`,
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
      link.setAttribute('download', `project-registrations-${id}.csv`);
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
  
  // Calculate project status
  const getProjectStatus = () => {
    if (!project) return "";
    
    const today = new Date();
    const launchDate = new Date(project.launchDate);
    
    if (today < launchDate) {
      const daysUntilLaunch = Math.ceil((launchDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilLaunch <= 30) {
        return "launching-soon";
      } else {
        return "upcoming";
      }
    } else {
      return "launched";
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Time ago
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
          <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading project details...</h3>
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
              to="/admin/upcoming-projects"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) return null;
  
  const status = getProjectStatus();
  const daysUntilLaunch = () => {
    const today = new Date();
    const launchDate = new Date(project.launchDate);
    const timeDiff = launchDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  return (
    <div className="min-h-screen pt-16 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <Link
              to="/admin/upcoming-projects"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects Management
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-500" />
              Project Details
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            {project.registrations && project.registrations.length > 0 && (
              <button
                onClick={exportRegistrations}
                className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 
                  transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Registrations
              </button>
            )}
            
            <Link
              to={`/admin/upcoming-projects/edit/${id}`}
              className="px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 
                transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Project
            </Link>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 
                transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Project
            </button>
          </div>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Launch Date</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(project.launchDate)}
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
                    ${status === 'upcoming' ? 'bg-blue-500' : 
                      status === 'launching-soon' ? 'bg-amber-500' : 'bg-green-500'}
                  `}></span>
                  {status === 'upcoming' ? 'Upcoming' : 
                    status === 'launching-soon' ? 'Launching Soon' : 'Launched'}
                  
                  {status !== 'launched' && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({daysUntilLaunch()} days to launch)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Registrations</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {project.registrations ? project.registrations.length : 0} {project.registrations && project.registrations.length === 1 ? 'User' : 'Users'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
                
                <div className="flex flex-col md:flex-row mb-6">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <img 
                      src={project.image?.[0]} 
                      alt={project.title} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    {project.image && project.image.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                        {project.image.slice(1).map((img, index) => (
                          <img 
                            key={index} 
                            src={img} 
                            alt={`${project.title} ${index + 2}`} 
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 md:pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      {project.propertyType}
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {project.location}
                    </div>
                    
                    <div className="mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-700" />
                      <span className="text-xl font-bold text-gray-900">
                        ₹{Number(project.priceRangeMin).toLocaleString('en-IN')} - ₹{Number(project.priceRangeMax).toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {project.totalUnits} Units
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {project.bedrooms} BHK
                        </span>
                      </div>
                      
                      {project.completionDate && (
                        <div className="flex items-center col-span-2">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Est. Completion: {formatDate(project.completionDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {project.specifications && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                      <p className="text-gray-600">{project.specifications}</p>
                    </div>
                  )}
                  
                  {project.developerInfo && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Developer Information</h4>
                      <p className="text-gray-600">{project.developerInfo}</p>
                    </div>
                  )}
                  
                  {project.amenities && project.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
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
          
          {/* Contact & Registration List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 text-blue-500 mr-2" />
                Contact Information
              </h2>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Contact Number</div>
                    <div className="text-blue-700">{project.contactPhone}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 text-purple-500 mr-2" />
                  User Registrations
                </h2>
                
                {project.registrations && project.registrations.length > 0 && (
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {project.registrations.length} total
                  </span>
                )}
              </div>
              
              {project.registrations && project.registrations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {project.registrations.slice(0, 8).map((registration, index) => (
                    <div key={index} className="py-3 flex items-start">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 mt-1">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{registration.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{registration.email} • {registration.phone}</div>
                        {registration.message && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md flex gap-1">
                            <MessageSquare className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{registration.message}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {timeAgo(registration.registeredAt)}
                      </div>
                    </div>
                  ))}
                  
                  {project.registrations.length > 8 && (
                    <div className="pt-3 text-center">
                      <button
                        onClick={exportRegistrations}
                        className="text-blue-600 text-sm hover:text-blue-800 flex items-center justify-center mx-auto"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download all {project.registrations.length} registrations
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
                  Confirm Deletion
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
                  Are you sure you want to delete <span className="font-medium text-gray-900">{project.title}</span>?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  This will permanently remove this project and all registrations associated with it. This action cannot be undone.
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
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingProjectDetails;