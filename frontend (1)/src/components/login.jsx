import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { Loader, Building, LogIn, Lock, Mail, ArrowRight } from "lucide-react";
import { Backendurl } from "../App";
import { authStyles } from "../styles/auth";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backendurl}/api/users/login`,
        formData
      );
      if (response.data.success) {
        await login(response.data.token, response.data.user);
        // toast.success("Login successful!");
        console.log("Login successful!");
        navigate("/");
      } else {
        // toast.error(response.data.message);
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // toast.error("An error occurred. Please try again.");
      console.error("An error occurred. Please try again.");
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
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
                </div>
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mt-6 text-2xl font-bold text-gray-800">
                  Welcome back
                </h2>
                <p className="mt-2 text-gray-600">
                  Please sign in to your account
                </p>
              </motion.div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Email Field */}
              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
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
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
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

              {/* Forgot Password Link */}
              <motion.div
                className="flex items-center justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)] font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
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
                        <LogIn className="w-5 h-5" />
                        <span>Sign in</span>
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
                transition={{ delay: 0.9 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/signup"
                  className="group w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-[var(--theme-color-1)] hover:text-[var(--theme-color-1)] transition-all duration-200"
                >
                  <span>Create an account</span>
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
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-3 text-center text-gray-500 text-sm"
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

export default Login;
