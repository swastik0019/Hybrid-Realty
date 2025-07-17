import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  MessageCircle,
  Home,
  Building,
  PlusCircle,
  TrendingUp,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hybridLogo from "../assets/Hybrid_Logo.png";

const popularLocations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
];

export const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      })`,
      opacity: 0,
    },
    to: inView
      ? {
          transform: `translate${directions[direction]}(0px)`,
          opacity: 1,
        }
      : {},
    config: { tension: 50, friction: 25 },
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typedText, setTypedText] = useState("");
  const phrases = ["Dream Home", "Perfect Investment", "Ideal Property"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const videoRef = useRef(null);

  // Typing effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const cursorBlinkSpeed = 500;

    // Cursor blinking effectt
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, cursorBlinkSpeed);

    // Typing/deleting effect
    const typerInterval = setTimeout(() => {
      if (!isDeleting) {
        // Still typing
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.substring(0, typedText.length + 1));
        } else {
          // Done typing, pause before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (typedText.length > 0) {
          setTypedText(typedText.substring(0, typedText.length - 1));
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        }
      }
    }, typeSpeed);

    return () => {
      clearTimeout(typerInterval);
      clearInterval(cursorInterval);
    };
  }, [typedText, currentPhraseIndex, isDeleting, phrases]);

  // Video background effect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
        // Add play button or other fallback if needed
      });
    }
  }, []);

  const handleSubmit = (location = searchQuery) => {
    navigate(`/properties?location=${encodeURIComponent(location)}`);
  };

  const handleSuggestionClick = (location) => {
    setSearchQuery(location);
    setShowSuggestions(false);
    handleSubmit(location);
  };

  return (
    <div className="relative w-full mt-11 h-screen overflow-hidden bg-white">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://videos.pexels.com/video-files/3674440/3674440-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay for video */}
        <div className="absolute inset-0 bg-black/45 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          {/* Logo and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-6 sm:mb-8 flex flex-col items-center w-full"
          >
            {/* Main Heading - Responsive text sizes */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 text-center leading-tight w-full px-4 sm:px-0">
              Invest, <span className="text-blue-400">Settle</span>{" "}
              <span className="text-white">&</span>{" "}
              <span className="text-green-400">Grow</span>
            </h1>
          </motion.div>

          {/* Search Bar - Responsive container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full max-w-4xl mx-auto relative px-4 sm:px-0"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/30 transition-all">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  placeholder="Enter location or property type..."
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-zinc-200 bg-zinc-50/90 text-zinc-800 placeholder-zinc-400 shadow-sm focus:ring-2 focus:ring-[var(--theme-hover-color-1)]/50 focus:border-[var(--theme-color-1)] transition-all text-sm sm:text-base"
                />
              </div>

              <button
                onClick={() => handleSubmit()}
                className="w-full sm:w-auto bg-[var(--theme-color-1)] text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-[var(--theme-hover-color-1)] transition-all flex items-center justify-center gap-2 font-medium shadow-md transform hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Search</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Action Buttons - Responsive grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 lg:gap-4 mt-6 sm:mt-8 sm:justify-center items-center max-w-2xl mx-auto w-full sm:w-auto px-4 sm:px-0"
          >
            {/* Hot Deals Button - Responsive sizing */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg sm:rounded-xl text-white hover:from-red-600 hover:to-orange-600 transition-all shadow-md relative overflow-hidden text-sm sm:text-sm font-medium min-h-[44px] sm:w-auto"
              onClick={() => navigate("/hot-deals")}
            >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg sm:rounded-xl"></div>
              
              <Flame className="w-4 h-4 sm:w-4 sm:h-4 text-yellow-200 animate-bounce" />
              <span className="relative z-10 whitespace-nowrap">Hot Deals</span>
            </motion.button>

            <motion.button
            whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-md text-sm sm:text-sm font-medium min-h-[44px] sm:w-auto relative overflow-hidden"
              onClick={() => navigate("/invest")}
              >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg sm:rounded-xl"></div>
              
              <TrendingUp className="w-4 h-4 sm:w-4 sm:h-4 text-green-100 animate-bounce relative z-10" />
              <span className="whitespace-nowrap relative z-10">Invest</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2.5 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 text-zinc-800 hover:bg-white/100 transition-all shadow-md text-sm sm:text-sm font-medium min-h-[44px] sm:w-auto"
              onClick={() => navigate("/add")}
            >
              <PlusCircle className="w-4 h-4 sm:w-4 sm:h-4 text-[var(--theme-color-1)]" />
              <span className="whitespace-nowrap">Add</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2.5 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 text-zinc-800 hover:bg-white/100 transition-all shadow-md text-sm sm:text-sm font-medium min-h-[44px] sm:w-auto"
              onClick={() => navigate("/lucky-draw")}
            >
              <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 text-[var(--theme-color-1)]" />
              <span className="whitespace-nowrap">Lucky draw </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;