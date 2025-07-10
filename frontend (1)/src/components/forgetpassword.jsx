import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader,
  Building,
  Key,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Backendurl } from "../App";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${Backendurl}/api/users/forgot`, {
        email,
      });
      if (response.data.success) {
        // toast.success("Reset link sent to your email!");
        console.log("Reset link sent to your email!");
        setEmailSent(true);
      } else {
        // toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      // toast.error("Failed to send reset link. Please try again.");
      console.log("Failed to send reset link. Please try again.");
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
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] p-3 rounded-xl shadow-lg shadow-blue-200"
                  >
                    <Building className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <motion.h2
                  whileHover={{ scale: 1.03 }}
                  className="text-3xl font-extrabold bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] bg-clip-text text-transparent drop-shadow-sm"
                >
                  Hybrid Realty
                </motion.h2>
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mt-6 text-2xl font-bold text-gray-800">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-gray-600">
                  {!emailSent
                    ? "No worries, we'll send you reset instructions."
                    : "Reset link sent! Check your inbox."}
                </p>
              </motion.div>
            </motion.div>

            {!emailSent ? (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                        focusedField === "email"
                          ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                      placeholder="Enter your registered email"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
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
                          <Key className="w-5 h-5" />
                          <span>Send Reset Link</span>
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

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4"
                >
                  <Link
                    to="/login"
                    className="group flex items-center justify-center text-[var(--theme-color-1)] hover:text-[var(--theme-hover-color-1)] transition-colors font-medium"
                  >
                    <motion.div
                      whileHover={{ x: -3 }}
                      className="flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span>Back to login</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Check Your Email
                </h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-[var(--theme-color-1)]">
                    {email}
                  </span>
                </p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Resend Email"
                    )}
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center py-3 bg-[var(--theme-color-1)] text-white rounded-lg hover:bg-[var(--theme-hover-color-1)] transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span>Back to login</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            © {new Date().getFullYear()} Hybrid Realty. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
