import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  UserPlus,
  Mail,
  Lock,
  Key,
  Building,
  ArrowRight,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Backendurl } from "../App";
import { authStyles } from "../styles/auth";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // Import the auth context

const Signup = () => {
  // Get login function from auth context
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // New states for OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [resendingOtp, setResendingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();

    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      // toast.error("Please fill all fields");
      console.error("Please fill all fields");
      return;
    }

    setLoading(true);
    setResendingOtp(!!otpSent);
    try {
      const response = await axios.post(
        `${Backendurl}/api/users/send-verification`,
        { email: formData.email }
      );

      if (response.data.success) {
        setOtpSent(true);
        setVerificationId(response.data.verificationId);
        // toast.success(
        //   otpSent ? "New OTP sent to your email" : "OTP sent to your email"
        // );
        console.log(
          otpSent ? "New OTP sent to your email" : "OTP sent to your email"
        );
      } else {
        // toast.error(response.data.message);
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      // toast.error(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
      setResendingOtp(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      // toast.error("Please enter the OTP");
      console.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${Backendurl}/api/users/verify-otp`, {
        verificationId,
        otp,
        userData: formData,
      });

      if (response.data.success) {
        // Use the login function from auth context instead of just setting localStorage
        // This will update the auth state immediately
        await login(
          response.data.token,
          // Use the user data from response if available, or create a basic user object from form data
          response.data.user || {
            name: formData.name,
            email: formData.email,
          }
        );

        // toast.success("Account created successfully!");
        console.log("Account created successfully!");
        navigate("/");
      } else {
        // toast.error(response.data.message);
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      // toast.error(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Background pattern SVG for decoration
  const bgPattern = (
    <div className="absolute inset-0 z-0 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Decorative elements */}
      {bgPattern}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-100 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-blue-100 to-transparent"></div>

      <div className="absolute opacity-20 -left-28 -top-28 w-96 h-96 bg-[var(--theme-color-1)] rounded-full filter blur-3xl"></div>
      <div className="absolute opacity-20 -right-28 -bottom-28 w-96 h-96 bg-[var(--theme-hover-color-1)] rounded-full filter blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Accent top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--theme-color-1)] via-blue-400 to-[var(--theme-hover-color-1)]"></div>

          <div className="p-8">
            {/* Logo & Title */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Link to="/" className="inline-block group">
                <div className="flex flex-col items-center justify-center mb-2">
                  <img
                    src="/hrLogoBlack.jpeg"
                    alt="Logo"
                    className="w-20 h-10"
                  />
                  {/* <h1 className="text-3xl font-extrabold leading-none">Hybrid.</h1>
                  <h1 className="text-md font-light">Realty</h1> */}
                </div>
                {/* <motion.h2
                  whileHover={{ scale: 1.03 }}
                  className="text-3xl font-extrabold bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] bg-clip-text text-transparent drop-shadow-sm"
                >
                  Hybrid Realty
                </motion.h2> */}
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mt-6 text-2xl font-bold text-gray-800">
                  Create an account
                </h2>
                <p className="mt-2 text-gray-600">
                  {!otpSent
                    ? "Join our community of property enthusiasts"
                    : "Verify your email to continue"}
                </p>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!otpSent ? (
                // Step 1: Registration Form
                <motion.form
                  key="registration"
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Name Field */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div
                      className={`relative group ${
                        focusedField === "name"
                          ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                        <UserPlus size={18} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                          focusedField === "name"
                            ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div
                      className={`relative group ${
                        focusedField === "email"
                          ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                          focusedField === "email"
                            ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                        placeholder="name@company.com"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div
                      className={`relative group ${
                        focusedField === "password"
                          ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-12 py-3 rounded-lg ${
                          focusedField === "password"
                            ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <motion.div
                            initial={{ rotate: -10, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                          >
                            <FaEyeSlash size={20} />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ rotate: 10, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                          >
                            <FaEye size={20} />
                          </motion.div>
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-medium shadow-lg shadow-blue-200 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-hover-color-1)] to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative flex items-center justify-center space-x-2">
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            <span>Get Verification Code</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                repeatDelay: 2,
                              }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </button>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    className="relative my-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">
                        Already have an account?
                      </span>
                    </div>
                  </motion.div>

                  {/* Sign In Link */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="group w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-[var(--theme-color-1)] hover:text-[var(--theme-color-1)] transition-all duration-200"
                    >
                      <span>Sign in to your account</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          repeatDelay: 3.5,
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.form>
              ) : (
                // Step 2: OTP Verification Form
                <motion.form
                  key="verification"
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-center mb-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 text-[var(--theme-color-1)] p-4 rounded-xl inline-block mb-3 shadow-md">
                      <motion.div
                        animate={{
                          rotate: resendingOtp ? [0, 360] : 0,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      >
                        <Mail className="w-7 h-7" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Verify your email
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
                      We've sent a verification code to{" "}
                      <span className="font-semibold text-[var(--theme-color-1)]">
                        {formData.email}
                      </span>
                    </p>
                  </motion.div>

                  {/* OTP Field */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Verification Code
                    </label>
                    <div
                      className={`relative group ${
                        focusedField === "otp"
                          ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                        <Key size={18} />
                      </div>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onFocus={() => setFocusedField("otp")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg text-center font-mono text-lg tracking-wider ${
                          focusedField === "otp"
                            ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                  </motion.div>

                  {/* Verify Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-medium shadow-lg shadow-blue-200 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-hover-color-1)] to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative flex items-center justify-center space-x-2">
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Verify & Create Account</span>
                          </>
                        )}
                      </div>
                    </button>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col space-y-4 mt-4"
                    initial={{ opacity: (a) => a * 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Resend OTP */}
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || resendingOtp}
                      className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-[var(--theme-color-1)] rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          resendingOtp ? "animate-spin" : ""
                        }`}
                      />
                      <span className="font-medium">
                        {resendingOtp
                          ? "Sending..."
                          : "Resend verification code"}
                      </span>
                    </button>

                    {/* Go Back Link */}
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      Go back to registration
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p>
            © {new Date().getFullYear()} Hybrid Realty. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
