import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare, Loader } from "lucide-react";
import useContactForm from "./useContactform";

function ContactForm() {
  const { formData, errors, handleChange, handleSubmit } = useContactForm();
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced submit handler to show loading state
  const onSubmit = async (e) => {
    setIsSubmitting(true);
    await handleSubmit(e);
    // Simulate loading for demo purposes
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--theme-color-1)] via-blue-400 to-[var(--theme-hover-color-1)]"></div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-blue-50 to-white rounded-bl-full opacity-70"></div>

      <div className="relative">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Send Us a Message
          </h2>
          <p className="text-gray-600 mb-6">
            Fill out the form below and we'll get back to you shortly
          </p>
        </motion.div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name Field */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name *
            </label>
            <div
              className={`relative group ${
                focusedField === "name"
                  ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                  : ""
              }`}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  focusedField === "name"
                    ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } border ${
                  errors.name ? "border-red-500" : ""
                } focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                placeholder="Harsh Taroliya"
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
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
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  focusedField === "email"
                    ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } border ${
                  errors.email ? "border-red-500" : ""
                } focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                placeholder="harsh@mail.com"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Phone Field */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number (Optional)
            </label>
            <div
              className={`relative group ${
                focusedField === "phone"
                  ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                  : ""
              }`}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  focusedField === "phone"
                    ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } border focus:border-[var(--theme-hover-color-1)] transition-all duration-200`}
                placeholder="+91 9911791469"
              />
            </div>
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message *
            </label>
            <div
              className={`relative group ${
                focusedField === "message"
                  ? "ring-2 ring-[var(--theme-hover-color-1)]/30 rounded-lg"
                  : ""
              }`}
            >
              <div className="absolute left-3 top-4 text-gray-400 group-hover:text-[var(--theme-color-1)] transition-colors">
                <MessageSquare size={18} />
              </div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                rows={10}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  focusedField === "message"
                    ? "bg-blue-50 border-[var(--theme-hover-color-1)]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } border ${
                  errors.message ? "border-red-500" : ""
                } focus:border-[var(--theme-hover-color-1)] transition-all duration-200 resize-none`}
                placeholder="How can we help you today?"
              />
            </div>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                {errors.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative group w-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center font-medium shadow-lg shadow-blue-200/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-hover-color-1)] to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatDelay: 2,
                      }}
                      className="w-4 h-4"
                    />
                  </>
                )}
              </div>
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

export default ContactForm;
