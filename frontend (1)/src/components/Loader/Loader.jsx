import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000); // 3 seconds minimum display time

    return () => clearTimeout(timer);
  }, []);

  return showLoader ? (
    <div className="w-full h-screen flex justify-center items-center">
      <motion.img
        src="/hrLogo.svg"
        alt="Loading..."
        className="w-96 h-96"
        animate={{
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  ) : null;
};

export default Loader;
