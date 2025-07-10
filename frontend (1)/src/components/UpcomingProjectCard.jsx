import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Building, Users, Clock, ChevronRight, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Backendurl } from "../App.jsx";
import { useNavigate } from "react-router";

const UpcomingProjectCard = ({ project }) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  
  // Calculate days until launch
  const daysUntilLaunch = () => {
    const today = new Date();
    const launchDate = new Date(project.launchDate);
    const timeDiff = launchDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${Backendurl}/api/upcoming-projects/register/${project._id}`,
        formData
      );
      
      if (response.data.success) {
        // toast.success("Registration successful! We'll notify you with updates.");
        console.log("Registration successful! We'll notify you with updates.");
        setShowRegisterModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        // toast.error(response.data.message || "Registration failed. Please try again.");
        console.error("Registration failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error registering for project:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Registration failed. Please try again later."
      // );
      console.error("Registration failed:", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };


  const navigate = useNavigate(); // Initialize navigation hook
  
  // Function to navigate to details page
  const navigateToDetails = () => {
    navigate(`/upcoming-projects/${project._id}`);
  };


  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        onClick={navigateToDetails}
        className="bg-white rounded-xl cursor-pointer shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col"
      >
        {/* Project Image */}
        <div className="relative">
          <img 
            src={project.image?.[0] || '/placeholder-project.jpg'} 
            alt={project.title} 
            className="w-full h-48 object-cover"
          />
          
          {/* Launch Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs uppercase font-bold rounded-full px-3 py-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {daysUntilLaunch()} days to launch
          </div>
        </div>
        
        {/* Project Info */}
        <div className="p-5 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{project.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
            <span className="text-sm">Expected Launch: {formatDate(project.launchDate)}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{project.registeredUsers || 0} people registered</span>
            </div>
            
            <div className="text-sm font-medium text-gray-600">
              {project.propertyType}
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <button
          onClick={navigateToDetails}
          className="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Register Interest <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </motion.div>
      
      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 text-blue-500 mr-2" />
                Register for {project.title}
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-700">
              Be among the first to receive updates and exclusive offers for this upcoming project.
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Any specific requirements or questions?"
                />
              </div>
              
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Register Interest"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingProjectCard;