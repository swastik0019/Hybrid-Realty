import React from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

// Lazy load components for performance
const ContactForm = React.lazy(() => import("../components/contact/contactForm"));
const ContactInfo = React.lazy(() => import("../components/contact/ContactInfo"));

const Contact = () => {
  // Background pattern for visual interest
  const bgPattern = (
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
  );

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        {/* Page Title */}
        <title>Contact Hybrid Realty - Legal Advice for Property Disputes</title>
        
        {/* Meta Description */}
        <meta 
          name="description" 
          content="Get expert legal advice for property disputes at Hybrid Realty. Contact our professional team for personalized real estate consultation and support."
        />
        
        {/* Keywords */}
        <meta 
          name="keywords" 
          content="property dispute, legal advice, real estate consultation, contact real estate, property legal help, real estate lawyers"
        />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Contact Hybrid Realty - Legal Advice for Property Disputes" />
        <meta 
          property="og:description" 
          content="Get expert legal advice for property disputes at Hybrid Realty. Contact our professional team for personalized real estate consultation and support."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta 
          property="og:image" 
          content="/contact-og-image.jpg" 
        />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Hybrid Realty - Legal Advice for Property Disputes" />
        <meta 
          name="twitter:description" 
          content="Get expert legal advice for property disputes at Hybrid Realty. Contact our professional team for personalized real estate consultation and support."
        />
        <meta 
          name="twitter:image" 
          content="/contact-og-image.jpg" 
        />
      </Helmet>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Hybrid Realty - Legal Property Consultation",
          "description": "Expert legal advice and consultation for real estate and property disputes",
          "url": window.location.origin,
          "telephone": "+1-555-123-4567", // Replace with actual contact number
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Real Estate Street",
            "addressLocality": "Delhi",
            "addressRegion": "Delhi",
            "postalCode": "110075",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.592106,
            "longitude": 77.023031
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": "+1-555-123-4567",
            "email": "contact@hybridrealty.com" // Replace with actual email
          },
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 28.592106,
              "longitude": 77.023031
            },
            "geoRadius": "50 km"
          }
        })}
      </script>

      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Background elements */}
        {bgPattern}
        <div className="absolute top-20 right-0 w-80 h-80 bg-[var(--theme-color-1)]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--theme-hover-color-1)]/10 rounded-full filter blur-3xl"></div>

        <React.Suspense fallback={<div>Loading...</div>}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-16 relative z-10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  Legal Advice for Property Dispute
                </motion.h1>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                <ContactForm />
                <ContactInfo />
              </div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-20 rounded-3xl overflow-hidden shadow-lg h-96 border-4 border-white"
                id="map"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7006.511266750969!2d77.02303136498499!3d28.592106952341446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1ab75625f03d%3A0xb08470618ba72e09!2sSector%2017%20Dwarka%2C%20Kakrola%2C%20Delhi%2C%20110075!5e0!3m2!1sen!2sin!4v1745056390151!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hybrid Realty Office Location"
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </React.Suspense>
      </div>
    </>
  );
};

export default Contact;