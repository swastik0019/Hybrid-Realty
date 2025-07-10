import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Mail,
  Send,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Linkedin,
  Heart,
  Building,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Backendurl } from "../App";
import hybridLogo from "../assets/Hybrid_Logo.png";

// Mobile Collapsible Footer Section
const MobileFooterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-blue-100/50 py-3 lg:border-none lg:py-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left lg:hidden"
      >
        <h3 className="text-sm font-bold tracking-wider text-gray-700 uppercase">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--theme-color-1)]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3 lg:mt-0 lg:h-auto lg:opacity-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Footer Column Component
const FooterColumn = ({ title, children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {title && (
        <h3 className="hidden lg:block text-sm font-bold tracking-wider text-gray-700 uppercase mb-5 relative">
          <span className="relative z-10">{title}</span>
          <span className="absolute left-0 bottom-0 w-8 h-0.5 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)]"></span>
        </h3>
      )}
      {children}
    </motion.div>
  );
};

// Footer Link Component - Updated to use React Router Link for internal routes
const FooterLink = ({ href, children, isExternal = false }) => {
  const LinkComponent = isExternal ? "a" : Link;
  const linkProps = isExternal 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <motion.div whileHover={{ x: 6 }}>
      <LinkComponent
        {...linkProps}
        className="flex items-center text-base text-gray-600 transition-all duration-200 hover:text-[var(--theme-color-1)] py-1.5 lg:py-1 group"
      >
        <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[var(--theme-hover-color-1)]" />
        {children}
      </LinkComponent>
    </motion.div>
  );
};

// Social Links Component
const socialLinks = [
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/hybridrealty.in?igsh=aDAwZ3ZhbnV4a3Nk",
    label: "Instagram",
    color: "from-pink-500 via-purple-500 to-blue-500",
  },
  {
    icon: Twitter,
    href: "#",
    label: "Twitter",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "Linkedin",
    color: "from-blue-500 to-blue-700",
  },
];

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-3 mt-6">
      {socialLinks.map(({ icon: Icon, href, label, color }) => (
        <motion.a
          key={label}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          href={href}
          title={label}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center text-white bg-gradient-to-br ${color} rounded-full w-10 h-10 shadow-md transition-all duration-200`}
        >
          <Icon className="w-4 h-4" />
        </motion.a>
      ))}
    </div>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      console.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      console.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="w-full"></div>;
};

// Main Footer Component
const companyLinks = [
  { name: "Home", href: "/", isExternal: false },
  { name: "Invest", href: "/invest", isExternal: false },
  { name: "Properties", href: "/properties", isExternal: false },
  { name: "Lucky Draw", href: "/lucky-draw", isExternal: false },
  { name: "Property Dispute", href: "/contact", isExternal: false },
];

const helpLinks = [
  { name: "Terms & Conditions", href: "/terms", isExternal: false },
  { name: "Privacy Policy", href: "/privacy", isExternal: false },
];

const contactInfo = [
  {
    icon: MapPin,
    text: "Dwarka Sector 17, New Delhi, India",
    href: "https://maps.app.goo.gl/97ekGkf3HqFYS9nt7",
    isExternal: true,
  },
  {
    icon: Phone,
    text: "+91 9911791469",
    href: "tel:9911791469",
    isExternal: true,
  },
  {
    icon: Mail,
    text: "Hybridrealty@gmail.com",
    href: "mailto:hybridrealty@gmail.com",
    isExternal: true,
  },
];

// Animated logo component
const AnimatedLogo = () => {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="block">
        <div className="bg-white p-2 rounded-xl shadow-md relative group">
          <motion.div>
            <img
              className="h-14 w-auto transition-all duration-300"
              src={hybridLogo}
              alt="Hybrid Realty"
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

// Contact info item component
const ContactItem = ({ icon: Icon, text, href, delay, isExternal = false }) => {
  const LinkComponent = isExternal ? "a" : Link;
  const linkProps = isExternal 
    ? { 
        href, 
        target: Icon === MapPin ? "_blank" : undefined,
        rel: Icon === MapPin ? "noopener noreferrer" : undefined 
      }
    : { to: href };

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.div whileHover={{ x: 3 }}>
        <LinkComponent
          {...linkProps}
          className="flex items-start group transition-all duration-200"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-sm mr-3 group-hover:from-blue-100 group-hover:to-blue-50 transition-colors">
            <Icon className="w-4 h-4 text-[var(--theme-color-1)]" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-[var(--theme-color-1)] transition-colors mt-1">
            {text}
            {Icon === MapPin && (
              <span className="inline-flex items-center ml-1 text-xs text-blue-500">
                <ExternalLink size={10} className="mr-0.5" />
                View map
              </span>
            )}
          </span>
        </LinkComponent>
      </motion.div>
    </motion.li>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="absolute inset-0 z-0 opacity-5">
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

      {/* Main Footer */}
      <div className="relative bg-gradient-to-b from-white via-blue-50 to-blue-100/50 pt-16 lg:pt-20 pb-12 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand section - Always visible above other sections on mobile */}
          <div className="mb-12 lg:mb-16">
            <div className="flex flex-col items-center lg:items-start">
              <AnimatedLogo />
            </div>

            <motion.p
              className="text-gray-600 mt-6 text-center lg:text-left max-w-md mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Your trusted partner in finding the perfect home. We make property
              hunting simple, efficient, and tailored to your unique needs.
            </motion.p>

            <div className="flex justify-center lg:justify-start">
              <SocialLinks />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* Quick Links Column */}
            <FooterColumn
              title="Quick Links"
              className="col-span-2"
              delay={0.2}
            >
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    className="group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <FooterLink href={link.href} isExternal={link.isExternal}>
                      {link.name}
                    </FooterLink>
                  </motion.li>
                ))}
              </ul>
            </FooterColumn>

            {/* Help Column */}
            <FooterColumn title="Support" className="col-span-2" delay={0.3}>
              <ul className="space-y-3">
                {helpLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    className="group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    <FooterLink href={link.href} isExternal={link.isExternal}>
                      {link.name}
                    </FooterLink>
                  </motion.li>
                ))}
              </ul>
            </FooterColumn>

            {/* Contact Info */}
            <FooterColumn title="Contact Us" className="col-span-3" delay={0.4}>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <ContactItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    href={item.href}
                    delay={0.5 + index * 0.1}
                    isExternal={item.isExternal}
                  />
                ))}
              </ul>
            </FooterColumn>

            {/* Newsletter */}
            <div className="col-span-5">
              <Newsletter />
            </div>
          </div>

          {/* Mobile Accordions */}
          <div className="lg:hidden space-y-4 mt-8">
            <MobileFooterSection title="Quick Links">
              <ul className="space-y-2 py-2">
                {companyLinks.map((link) => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href} isExternal={link.isExternal}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Support">
              <ul className="space-y-2 py-2">
                {helpLinks.map((link) => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href} isExternal={link.isExternal}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Contact Us">
              <ul className="space-y-3 py-2">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    {item.isExternal ? (
                      <a
                        href={item.href}
                        className="flex items-start group transition-all duration-200"
                        target={item.icon === MapPin ? "_blank" : undefined}
                        rel={
                          item.icon === MapPin ? "noopener noreferrer" : undefined
                        }
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-sm mr-3 group-hover:from-blue-100 group-hover:to-blue-50 transition-colors">
                          <item.icon className="w-4 h-4 text-[var(--theme-color-1)]" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-[var(--theme-color-1)] transition-colors mt-1">
                          {item.text}
                          {item.icon === MapPin && (
                            <span className="inline-flex items-center ml-1 text-xs text-blue-500">
                              <ExternalLink size={10} className="mr-0.5" />
                              View map
                            </span>
                          )}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-start group transition-all duration-200"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-sm mr-3 group-hover:from-blue-100 group-hover:to-blue-50 transition-colors">
                          <item.icon className="w-4 h-4 text-[var(--theme-color-1)]" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-[var(--theme-color-1)] transition-colors mt-1">
                          {item.text}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <div>
              <Newsletter />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-gradient-to-r from-blue-100/80 via-white to-blue-100/80 border-t border-blue-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            className="text-sm text-gray-600 mb-4 md:mb-0 text-center md:text-left flex items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            © {currentYear} Hybrid Realty. All Rights Reserved.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/properties"
              className="flex items-center bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md group overflow-hidden relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--theme-hover-color-1)] to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Browse Our Properties
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </footer>
  );
};

export default Footer;