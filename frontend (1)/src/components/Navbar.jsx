import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  Search,
  Building,
  PlusSquare,
  TrendingUp,
  Users,
  Gavel,
  MessageCircle,
  Sparkles,
  BotMessageSquare,
  Gift,
  Heart,
} from "lucide-react";
import logo from "../assets/Hybrid_Logo.png";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bg-white shadow-lg inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <motion.div className="rounded-lg">
                <img
                  src={logo}
                  alt="Hybrid Realty logo"
                  className="h-8 w-auto sm:h-10 transition-all duration-300"
                />
              </motion.div>
              {/* Hidden on smaller screens, visible on medium and up */}
              {/* <span className="hidden md:inline-block text-lg font-bold bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] bg-clip-text text-transparent">
                Hybrid Realty
              </span> */}
            </NavLink>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
<div className="hidden md:flex items-center space-x-1">
  <NavLinks currentPath={location.pathname} />
</div>

{/* Auth Buttons - Hidden on mobile */}
<div className="hidden md:flex items-center space-x-4">
  {isLoggedIn ? (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] flex items-center justify-center text-white font-medium text-sm shadow-md">
            {getInitials(user?.name)}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
            
            {/* My Properties option */}
            <NavLink to="/my-properties">
              <motion.div
                whileHover={{ x: 5 }}
                onClick={() => {setIsDropdownOpen(false)}}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
              >
                <Building className="w-4 h-4" />
                <span>My Properties</span>
              </motion.div>
            </NavLink>
            
            {/* Wishlist option */}
            <NavLink to="/wishlist">
              <motion.div
                whileHover={{ x: 5 }}
                onClick={() => {setIsDropdownOpen(false)}}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>My Wishlist</span>
              </motion.div>
            </NavLink>
            
            <motion.button
              whileHover={{ x: 5 }}
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="flex items-center space-x-3">
      <NavLink
        to="/login"
        className="text-gray-700 hover:text-[var(--theme-color-1)] font-medium transition-colors"
      >
        Sign in
      </NavLink>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <NavLink
          to="/signup"
          className="bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-color-1)] text-white px-4 py-2 rounded-lg hover:from-[var(--theme-hover-color-1)] hover:to-[var(--theme-hover-color-1)] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          Get started
        </NavLink>
      </motion.div>
    </div>
  )}
</div>

{/* Mobile menu button */}
<motion.button
  whileTap={{ scale: 0.9 }}
  onClick={toggleMobileMenu}
  className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors focus:outline-none"
  aria-label="Toggle menu"
  aria-expanded={isMobileMenuOpen}
>
  {isMobileMenuOpen ? (
    <X className="w-6 h-6" />
  ) : (
    <Menu className="w-6 h-6" />
  )}
</motion.button>

{/* Mobile menu - Only visible on mobile */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 md:hidden"
    >
      <div className="flex flex-col p-4">
        {/* Mobile navigation links */}
        <div className="py-2">
          <NavLinks currentPath={location.pathname} isMobile={true} />
        </div>
        
        {/* User info section */}
        {isLoggedIn ? (
          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] flex items-center justify-center text-white font-medium text-sm shadow-md">
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            {/* Mobile user menu options */}
            <div className="space-y-2">
              <NavLink 
                to="/my-properties" 
                className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building className="w-5 h-5 mr-3" />
                My Properties
              </NavLink>
              
              <NavLink 
                to="/wishlist" 
                className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 mr-3" />
                My Wishlist
              </NavLink>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
            <NavLink
              to="/login"
              className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full text-center font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </NavLink>
            
            <NavLink
              to="/signup"
              className="block bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md w-full text-center font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get started
            </NavLink>
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLinks
                setMobileMenuOpen={setIsMobileMenuOpen}
                isLoggedIn={isLoggedIn}
                user={user}
                handleLogout={handleLogout}
                currentPath={location.pathname}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLinks = ({ currentPath }) => {
  // Enhanced NavLinks for desktop view
  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Add", path: "/add", icon: PlusSquare },
    { name: "Invest", path: "/invest", icon: TrendingUp },
    { name: "Properties", path: "/properties", icon: Search },
    { name: "Lucky Draw", path: "/lucky-draw", icon: Gift },
    { name: "Upcoming Projects", path: "/upcoming-projects", icon: Building },
    { name: "Property Dispute", path: "/contact", icon: Gavel },
  ];

  return (
    <div className="flex items-center">
      {navLinks.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <NavLink
            key={name}
            to={path}
            className={`relative font-medium transition-colors duration-200 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm lg:text-base
              ${
                isActive
                  ? "text-[var(--theme-color-1)] bg-blue-50 text-black"
                  : "text-zinc-600 hover:text-[var(--theme-color-1)] hover:bg-gray-50"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{name}</span>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-0 left-1 right-1 h-0.5 bg-[var(--theme-color-1)] rounded-full"
                initial={false}
              />
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

const MobileNavLinks = ({
  setMobileMenuOpen,
  isLoggedIn,
  user,
  handleLogout,
  currentPath,
}) => {
  // Updated navigation links for mobile view
  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Add", path: "/add", icon: PlusSquare },
    { name: "Invest", path: "/invest", icon: TrendingUp },
    { name: "Properties", path: "/properties", icon: Search },
    { name: "Lucky Draw", path: "/lucky-draw", icon: Gift },
    { name: "Upcoming Projects", path: "/upcoming-projects", icon: Building },
    { name: "Property Dispute", path: "/contact", icon: Gavel },
  ];

  return (
    <div className="flex flex-col space-y-1">
      {/* Navigation Links */}
      {navLinks.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <motion.div key={name} whileTap={{ scale: 0.97 }}>
            <NavLink
              to={path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-[var(--theme-color-1)] font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-color-1)]"
                }
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {name}
            </NavLink>
          </motion.div>
        );
      })}

      {/* Auth Buttons for Mobile */}
      <div className="pt-3 mt-2 border-t border-gray-100">
        {isLoggedIn ? (
          <div className="space-y-2 px-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-hover-color-1)] flex items-center justify-center text-white font-medium text-sm">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 px-3 pt-2">
            <motion.div whileTap={{ scale: 0.97 }}>
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
              >
                Sign in
              </NavLink>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-[var(--theme-color-1)] to-[var(--theme-color-1)] text-white rounded-lg hover:from-[var(--theme-hover-color-1)] hover:to-[var(--theme-hover-color-1)] transition-all font-medium text-sm shadow-md"
              >
                Get started
              </NavLink>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
};

MobileNavLinks.propTypes = {
  setMobileMenuOpen: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default Navbar;