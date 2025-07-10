import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Gift, 
  Loader, 
  Phone, 
  User, 
  Mail, 
  AlertCircle,
  Check,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import { Backendurl } from "../App.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LuckyDrawRegistrationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    agreeTerms: false
  });
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn) {
      // toast.error("Please login to register for lucky draw");
      console.log("Please login to register for lucky draw");
      navigate("/login");
      return;
    }
    
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/lucky-draw/property/${id}`);
        
        if (response.data.success) {
          const propertyData = response.data.property;
          
          // Check if registration is closed
          const today = new Date();
          const endDate = new Date(propertyData.biddingEndDate);
          if (today > endDate) {
            setError("Registration for this lucky draw has ended");
            setLoading(false);
            return;
          }
          
          // Check if user is already registered
          if (propertyData.isUserRegistered) {
            setError("You are already registered for this lucky draw");
            setLoading(false);
            return;
          }
          
          setProperty(propertyData);
        } else {
          setError(response.data.message || "Failed to load property details");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, isLoggedIn, navigate, user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.phone || formData.phone.length < 10) {
      // toast.error("Please enter a valid phone number");
      console.log("Please enter a valid phone number");
      return;
    }
    
    if (!formData.agreeTerms) {
      // toast.error("You must agree to the terms and conditions");
      console.log("You must agree to the terms and conditions");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${Backendurl}/api/lucky-draw/register`,
        {
          propertyId: id,
          phone: formData.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        // toast.success("Registration successful!");
        console.log("Registration successful!");
        console.log("Registration successful:", response.data);
      } else {
        // toast.error(response.data.message || "Registration failed");
        console.error("Registration failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error registering for lucky draw:", err);
      // toast.error(
      //   err.response?.data?.message || 
      //   "Failed to register. Please try again."
      // );
      console.error("Failed to register:", err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[var(--theme-color-1)] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
          
          <div className="flex justify-center">
            <Link
              to={`/lucky-draw/property/${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-color-1)] text-white rounded-lg hover:bg-[var(--theme-hover-color-1)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Property
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              You have successfully registered for the lucky draw for {property.title}.
            </p>
            <div className="text-sm text-green-600 bg-green-50 p-4 rounded-lg mb-4">
              <p>The draw will take place after {formatDate(property.biddingEndDate)}</p>
              <p className="mt-2">Winners will be notified via email and phone</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link
              to="/lucky-draw"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--theme-color-1)] text-white rounded-lg hover:bg-[var(--theme-hover-color-1)] transition-colors"
            >
              <Gift className="w-4 h-4" />
              Explore More Lucky Draws
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Link
            to={`/lucky-draw/property/${id}`}
            className="inline-flex items-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Property
          </Link>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Property Summary - Left Side */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="relative h-48">
                <img
                  src={property.image[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-[var(--theme-investment-card-tag)] to-yellow-400 text-white 
                    px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    Lucky Draw
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-[var(--theme-investment-card-tag)]" />
                  {property.location}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Property Value:</span>
                    <span className="font-medium text-gray-900">₹{Number(property.price).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registration Ends:</span>
                    <span className="font-medium text-gray-900">{formatDate(property.biddingEndDate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registrations:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {property.registeredUsers || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Registration Form - Right Side */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6 text-[var(--theme-investment-card-tag)]" />
                Register for Lucky Draw
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="form-group">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="focus:ring-[var(--theme-investment-card-tag)] focus:border-[var(--theme-investment-card-tag)] block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Your name"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="focus:ring-[var(--theme-investment-card-tag)] focus:border-[var(--theme-investment-card-tag)] block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-md"
                          placeholder="you@example.com"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="focus:ring-[var(--theme-investment-card-tag)] focus:border-[var(--theme-investment-card-tag)] block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Your 10-digit phone number"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        We'll use this to contact you if you win the lucky draw
                      </p>
                    </div>
                  </div>
                  
                  <div className="form-group bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Lucky Draw Terms</h3>
                    <div className="text-xs text-gray-600 space-y-2">
                      <p>• Registration deadline is {formatDate(property.biddingEndDate)}</p>
                      <p>• One registration per user is allowed</p>
                      <p>• Winners will be selected randomly after registration closes</p>
                      <p>• The winner gets priority access to purchase this property</p>
                      <p>• The draw results are final and cannot be contested</p>
                    </div>
                    
                    <div className="mt-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-[var(--theme-investment-card-tag)] border-gray-300 rounded focus:ring-[var(--theme-investment-card-tag)]"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I agree to the terms and conditions
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-[var(--theme-investment-card-tag)] to-yellow-500 text-white py-3 rounded-lg 
                      hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center 
                      justify-center gap-2 font-medium shadow-md"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Register for Lucky Draw
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawRegistrationForm;