import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Building, 
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
import AddUpcomingProjectModal from "./AddUpcomingProjectModal"; // We'll create this next

const AdminUpcomingProjectsManagement = () => {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  
  useEffect(() => {
    fetchUpcomingProjects();
  }, []);
  
  const fetchUpcomingProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/upcoming-projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log(response);
      
      if (response.data.success) {
        setUpcomingProjects(response.data.projects);
        setError(null);
      } else {
        setError(response.data.message || "Failed to load upcoming projects");
      }
    } catch (err) {
      console.error("Error fetching upcoming projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveProject = async () => {
    if (!selectedProject) return;
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(
        `${backendurl}/api/admin/upcoming-projects/delete/${selectedProject._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // toast.success("Project removed successfully");
        console.log("Project removed successfully");
        setShowDeleteModal(false);
        setSelectedProject(null);
        // Refetch the list
        fetchUpcomingProjects();
      } else {
        // toast.error(response.data.message || "Failed to remove project");
        console.error("Failed to remove project:", response.data.message);
      }
    } catch (err) {
      console.error("Error removing project:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to remove project. Please try again."
      // );
      console.error("Failed to remove project:", err.response?.data?.message);
    }
  };
  
  const exportRegistrations = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${backendurl}/api/admin/upcoming-projects/export-registrations/${projectId}`,
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
      link.setAttribute('download', `upcoming-project-registrations-${projectId}.csv`);
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
  const getProjectStatus = (project) => {
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
  
  // Filter and search projects
  const filteredProjects = upcomingProjects.filter(project => {
    const matchesSearch = 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    const status = getProjectStatus(project);
    return matchesSearch && status === filterStatus;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days until launch
  const getDaysUntilLaunch = (launchDate) => {
    const today = new Date();
    const launch = new Date(launchDate);
    const timeDiff = launch.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mt-12 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upcoming Projects Management</h1>
          <p className="text-gray-600">Create and manage upcoming projects and track user interest</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddProjectModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </motion.button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by project name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg py-2 px-3 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="launching-soon">Launching Soon</option>
              <option value="launched">Launched</option>
            </select>
          </div>
          
          <button
            onClick={fetchUpcomingProjects}
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
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading upcoming projects...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchUpcomingProjects}
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
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{upcomingProjects.length}</h3>
                  <p className="text-sm text-gray-500">Total Projects</p>
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
                    {upcomingProjects.filter(p => getProjectStatus(p) === "upcoming").length}
                  </h3>
                  <p className="text-sm text-gray-500">Upcoming Projects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {upcomingProjects.filter(p => getProjectStatus(p) === "launching-soon").length}
                  </h3>
                  <p className="text-sm text-gray-500">Launching Soon</p>
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
                    {upcomingProjects.reduce((sum, proj) => sum + (proj.registeredUsers || 0), 0)}
                  </h3>
                  <p className="text-sm text-gray-500">Total Registrations</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Launch Date
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
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {
                      const status = getProjectStatus(project);
                      const daysUntilLaunch = getDaysUntilLaunch(project.launchDate);
                      
                      return (
                        <tr key={project._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-md object-cover" 
                                  src={project.image?.[0] || '/placeholder-property.jpg'} 
                                  alt={project.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                <div className="text-sm text-gray-500">{project.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(project.launchDate)}
                            </div>
                            {daysUntilLaunch > 0 && (
                              <div className="text-xs text-gray-500">
                                {daysUntilLaunch} days remaining
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                                status === 'launching-soon' ? 'bg-amber-100 text-amber-800' : 
                                'bg-green-100 text-green-800'}`}
                            >
                              {status === 'upcoming' ? 'Upcoming' : 
                                status === 'launching-soon' ? 'Launching Soon' : 'Launched'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{project.registeredUsers || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => exportRegistrations(project._id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Export Registrations"
                                disabled={!project.registeredUsers}
                              >
                                <Download className={`w-5 h-5 ${!project.registeredUsers ? 'opacity-50 cursor-not-allowed' : ''}`} />
                              </button>
                              
                              <Link 
                                to={`/admin/upcoming-projects/${project._id}`}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Project"
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
                          ? "No projects match your search criteria" 
                          : "No upcoming projects available. Add a project to get started."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Add Project Modal */}
      <AddUpcomingProjectModal 
        showModal={showAddProjectModal}
        setShowModal={setShowAddProjectModal}
        onSuccess={fetchUpcomingProjects}
      />
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProject && (
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
                  Are you sure you want to delete <span className="font-medium text-gray-900">{selectedProject.title}</span>?
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
                  onClick={handleRemoveProject}
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

export default AdminUpcomingProjectsManagement;