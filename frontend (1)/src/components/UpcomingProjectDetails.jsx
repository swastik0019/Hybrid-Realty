import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Share2,
  Building,
  Loader,
  Maximize,
  Copy,
  IndianRupee,
  AlertCircle,
  Phone,
  CheckCircle,
  Mail,
  Home
} from "lucide-react";
import { Backendurl } from "../App.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const UpcomingProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/upcoming-projects/${id}`);
        
        if (response.data.success) {
          setProject(response.data.project);
          setError(null);
          
          // Pre-fill form if user is logged in
          if (isLoggedIn && user) {
            setFormData(prev => ({
              ...prev,
              name: user.name || prev.name,
              email: user.email || prev.email
            }));
          }
        } else {
          setError(response.data.message || "Failed to load project details.");
        }
      } catch (err) {
        console.error("Error fetching upcoming project details:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, isLoggedIn, user]);

  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleKeyNavigation = useCallback((e) => {
    if (!project || !project.image || project.image.length <= 1) return;
    
    if (e.key === 'ArrowLeft') {
      setActiveImage(prev => (prev === 0 ? project.image.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setActiveImage(prev => (prev === project.image.length - 1 ? 0 : prev + 1));
    }
  }, [project]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: `Check out this upcoming property: ${project.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      // toast.error("Please fill all required fields");
      console.error("Please fill all required fields");
      return;
    }
    
    try {
      setRegistrationLoading(true);
      
      const response = await axios.post(
        `${Backendurl}/api/upcoming-projects/register/${id}`,
        formData
      );
      
      if (response.data.success) {
        // toast.success("Registration successful! We'll notify you with updates about this project.");
        console.log("Registration successful! We'll notify you with updates about this project.");
        setShowRegistrationForm(false);
        
        // Update the project data to reflect the new registration count
        setProject(prev => ({
          ...prev,
          registeredUsers: (prev.registeredUsers || 0) + 1,
          isUserRegistered: true
        }));
      } else {
        // toast.error(response.data.message || "Registration failed. Please try again.");
        console.error("Registration failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error registering interest:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to register. Please try again later."
      // );
      console.error("Failed to register:", err.response?.data?.message);
    } finally {
      setRegistrationLoading(false);
    }
  };
  
  // Calculate days until launch
  const daysUntilLaunch = () => {
    if (!project) return 0;
    
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Project Details</h3>
          <p className="text-gray-600">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/upcoming-projects"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Upcoming Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/upcoming-projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upcoming Projects
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600">
                <Copy className="w-5 h-5 mr-1" />
                Copied!
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </nav>

        {/* Upcoming Project Status Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Upcoming Project</h3>
                <p className="text-sm text-blue-700">
                  Expected Launch: {formatDate(project.launchDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{daysUntilLaunch()}</span>
                  <span className="text-xs text-gray-500">days to launch</span>
                </div>
              </div>
              
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{project.registeredUsers || 0}</span>
                  <span className="text-xs text-gray-500">interested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden mb-8">
            {project.image && project.image.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={project.image[activeImage]}
                  alt={`${project.title} - View ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Building className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Upcoming Project Badge */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span className="font-medium">Upcoming Project</span>
            </div>

            {/* Launch Badge */}
            <div className="absolute top-4 right-4 bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{daysUntilLaunch()} days to launch</span>
            </div>

            {/* Image Navigation */}
            {project.image && project.image.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(prev => 
                    prev === 0 ? project.image.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImage(prev => 
                    prev === project.image.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {project.image && project.image.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
                bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {activeImage + 1} / {project.image.length}
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {project.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {/* Project Overview */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Overview</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Project Type:</span>
                      <span className="font-medium text-gray-900">{project.propertyType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Expected Launch:</span>
                      <span className="font-medium text-gray-900">{formatDate(project.launchDate)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Expected Completion:</span>
                      <span className="font-medium text-gray-900">
                        {project.completionDate ? formatDate(project.completionDate) : "To be announced"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Registrations:</span>
                      <span className="font-medium text-gray-900">{project.registeredUsers || 0} people</span>
                    </div>
                    
                    {project.priceRange && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Starting Price:</span>
                        <span className="font-medium text-gray-900">₹{project.priceRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Highlights */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Highlights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.highlights && project.highlights.map((highlight, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                    
                    {/* If no highlights are available, show some default ones based on project type */}
                    {(!project.highlights || project.highlights.length === 0) && (
                      <>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Premium Location
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Modern Design
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Spacious Layouts
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          High-quality Construction
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Registration Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg 
                      hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Building className="w-5 h-5" />
                    Register Interest
                  </button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Register to receive updates and exclusive offers
                  </p>
                </div>
                
                {/* If user already registered, show message */}
                {project.isUserRegistered && (
                  <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You've registered interest!</span>
                    </div>
                    <p className="text-sm text-green-600">
                      You'll receive updates about this project as soon as new information becomes available.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Expected Units Information */}
                {project.units && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Available Units</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.units.map((unit, index) => (
                        <div 
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <h3 className="font-medium text-gray-800 mb-2">{unit.type}</h3>
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <div className="text-gray-600">Size:</div>
                            <div className="text-gray-800">{unit.size} sqft</div>
                            {unit.bedrooms && (
                              <>
                                <div className="text-gray-600">Bedrooms:</div>
                                <div className="text-gray-800">{unit.bedrooms}</div>
                              </>
                            )}
                            {unit.price && (
                              <>
                                <div className="text-gray-600">Price:</div>
                                <div className="text-gray-800">₹{unit.price}</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Expected Amenities */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Expected Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.amenities && project.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                        {amenity}
                      </div>
                    ))}
                    
                    {/* If no amenities are available, show some default ones based on project type */}
                    {(!project.amenities || project.amenities.length === 0) && (
                      <>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Swimming Pool
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Fitness Center
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Landscaped Gardens
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          24/7 Security
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Children's Play Area
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          Clubhouse
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="mb-6 bg-blue-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Have Questions?
                  </h2>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    {project.contactPhone || import.meta.env.VITE_CONTACT_NUMBER || "Contact Phone"}
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    {project.contactEmail || "info@hybridrealty.com"}
                  </div>
                  <p className="text-sm text-gray-500">
                    Our customer service team is available Monday to Saturday, 9 AM to 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Modal */}
        <AnimatePresence>
          {showRegistrationForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 text-blue-500 mr-2" />
                    Register for {project.title}
                  </h3>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">terms and conditions</a>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                      disabled={registrationLoading}
                    >
                      {registrationLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Building className="w-4 h-4" />
                          Register Now
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Location */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {project.location}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(project.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </div>
        
        {/* Similar Projects */}
        {project.similarProjects && project.similarProjects.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.similarProjects.map((similarProject) => (
                <Link 
                  key={similarProject._id}
                  to={`/upcoming-projects/${similarProject._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {similarProject.image ? (
                      <img 
                        src={similarProject.image[0]} 
                        alt={similarProject.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1">
                      {new Date(similarProject.launchDate).getTime() > new Date().getTime() ? 
                        `${Math.ceil((new Date(similarProject.launchDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` : 
                        'Launching soon'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{similarProject.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{similarProject.location}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Launch: {formatDate(similarProject.launchDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UpcomingProjectDetails;