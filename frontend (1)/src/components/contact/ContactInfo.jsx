import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

// Enhanced ContactInfoItem component
const ContactInfoItem = ({ icon: Icon, title, content, link, delay }) => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.4 }}
    >
      <motion.a
        href={link}
        whileHover={{
          scale: 1.02,
          backgroundColor: "rgba(239, 246, 255, 0.7)", // very light blue
        }}
        className="flex items-start p-4 rounded-xl transition-all duration-300 group"
      >
        <div className="mr-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:from-[var(--theme-color-1)]/10 group-hover:to-[var(--theme-hover-color-1)]/20 transition-colors duration-300">
            <Icon className="w-6 h-6 text-[var(--theme-color-1)]" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[var(--theme-color-1)] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600">{content}</p>
        </div>
      </motion.a>
    </motion.div>
  );
};

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    content: "+91 9911791469",
    link: "tel:9911791469",
  },
  {
    icon: Mail,
    title: "Email Us",
    content: "Hybridrealty@gmail.com",
    link: "mailto:hybridrealty@gmail.com",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    content: "Dwarka Sector 17, New Delhi, India",
    link: "https://maps.app.goo.gl/97ekGkf3HqFYS9nt7",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Mon-Fri: 8 AM - 8 PM",
    link: "#",
  },
];

const SocialButton = ({ icon: Icon, href, color, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`p-3 rounded-full ${color} text-white shadow-lg flex items-center justify-center`}
  >
    <Icon className="w-5 h-5" />
  </motion.a>
);

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--theme-hover-color-1)] via-blue-400 to-[var(--theme-color-1)]"></div>

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-b from-blue-50 to-white rounded-br-full opacity-70"></div>

      <div className="relative">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Our Office
          </h2>
          <p className="text-gray-600 mb-6">Get in touch with our team</p>
        </motion.div>

        <div className="space-y-3 mb-10">
          {contactInfo.map((info, index) => (
            <ContactInfoItem key={index} {...info} delay={0.2 + index * 0.1} />
          ))}
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-100 pt-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg font-semibold text-gray-800 mb-4"
          >
            Connect With Us
          </motion.h3>

          <div className="flex space-x-4">
            <SocialButton
              icon={Facebook}
              href="https://facebook.com"
              color="bg-[#1877F2]"
              delay={0.6}
            />
            <SocialButton
              icon={Instagram}
              href="https://instagram.com"
              color="bg-gradient-to-br from-[#fa7e1e] via-[#d62976] to-[#962fbf]"
              delay={0.7}
            />
            <SocialButton
              icon={Twitter}
              href="https://twitter.com"
              color="bg-[#1DA1F2]"
              delay={0.8}
            />
            <SocialButton
              icon={Linkedin}
              href="https://linkedin.com"
              color="bg-[#0A66C2]"
              delay={0.9}
            />
          </div>
        </div>

        {/* Business Hours Visual Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-10 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[var(--theme-color-1)]" />
            Current Status
          </h3>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <p className="text-green-600 font-medium">We're Open Now</p>
            <span className="ml-2 text-xs text-gray-500">
              (8:00 AM - 8:00 PM)
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
