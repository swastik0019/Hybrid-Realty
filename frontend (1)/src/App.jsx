// export const Backendurl = 'https://hybridrealty-dev-backend.onrender.com';
// export const Backendurl = import.meta.env.VITE_BACKEND_URL;
// export const Backendurl = 'http://localhost:4000';
export const Backendurl = '';

import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import MyProperties from "./pages/MyProperties";
import EditMyProperty from "./pages/EditMyProperty";
import UpcomingProjectDetails from "./components/UpcomingProjectDetails";
import HotDealsPage from "./pages/HotDealsPage";
import Wishlist from "./pages/Wishlist";
import Loader from "./components/Loader/Loader";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load components for performance
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/footer"));
const Home = lazy(() => import("./pages/Home"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() =>
  import("./components/properties/propertydetail")
);
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./components/login"));
const Signup = lazy(() => import("./components/signup"));
const ForgotPassword = lazy(() => import("./components/forgetpassword"));
const ResetPassword = lazy(() => import("./components/resetpassword"));
const NotFoundPage = lazy(() => import("./components/Notfound"));
const Add = lazy(() => import("./pages/Add"));
const InvestPage = lazy(() => import("./pages/InvestPage"));
const LuckyDrawPage = lazy(() => import("./components/LuckyDrawPage"));
const LuckyDrawPropertyDetails = lazy(() =>
  import("./components/LuckyDrawPropertyDetails")
);
const InvestPropertyDetails = lazy(() =>
  import("./components/properties/InvestPropertyDetails")
);
const UpcomingProjectsPage = lazy(() =>
  import("./components/UpcomingProjectsPage")
);
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// SEO Metadata Component
const PageMetadata = ({
  title = "Hybrid Realty",
  description = "Discover your perfect property with Hybrid Realty",
  keywords = "real estate, properties, investment, luxury homes",
  ogImage = "/default-og-image.jpg",
}) => (
  <Helmet>
    {/* Standard Metadata */}
    <title>{title} | Hybrid Realty</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${title} | Hybrid Realty`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={window.location.href} />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${title} | Hybrid Realty`} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    {/* Canonical Link */}
    <link rel="canonical" href={window.location.href} />
  </Helmet>
);

// Define routes that should not have Navbar and Footer
const routesWithoutNavbarFooter = ["/login", "/signup", "/forgot-password"];

// Main App Content Component
const AppContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if current path should display navbar/footerr
  const shouldShowNavbarFooter = !routesWithoutNavbarFooter.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      {/* Dynamic Page Metadata */}
      <PageMetadata
        title={getPageTitle(location.pathname)}
        description={getPageDescription(location.pathname)}
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData(location.pathname))}
      </script>

      <ScrollToTop/>

      {/* Conditionally render Navbar */}
      <Suspense fallback={<Loader />}>
        {shouldShowNavbarFooter && <Navbar />}

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/single/:id" element={<PropertyDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route
            path="/invest/single/:id"
            element={<InvestPropertyDetails />}
          />
          <Route path="/add" element={<Add />} />
          <Route path="/lucky-draw" element={<LuckyDrawPage />} />
          <Route path="/upcoming-projects" element={<UpcomingProjectsPage />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/edit-property/:id" element={<EditMyProperty />} />
          <Route
            path="/upcoming-projects/:id"
            element={<UpcomingProjectDetails />}
          />
          <Route path="/hot-deals" element={<HotDealsPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route
            path="/lucky-draw/property/:id"
            element={<LuckyDrawPropertyDetails />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Conditionally render Footer */}
        {shouldShowNavbarFooter && <Footer />}
      </Suspense>

      <ToastContainer />
    </>
  );
};

// Utility Functions for Dynamic Metadata
const getPageTitle = (pathname) => {
  const titles = {
    "/": "Home",
    "/properties": "Property Listings",
    "/invest": "Investment Opportunities",
    "/lucky-draw": "Lucky Draw",
    "/contact": "Contact Us",
    // Add more routes as needed
  };
  return titles[pathname] || "Hybrid Realty";
};

const getPageDescription = (pathname) => {
  const descriptions = {
    "/": "Find your dream property with Hybrid Realty",
    "/properties": "Browse our extensive collection of properties",
    "/invest": "Explore lucrative real estate investment opportunities",
    "/lucky-draw": "Participate in our exclusive property lucky draw",
    "/contact": "Get in touch with Hybrid Realty",
    // Add more routes as needed
  };
  return (
    descriptions[pathname] || "Hybrid Realty - Your trusted real estate partner"
  );
};

// Generate Structured Data based on current route
const generateStructuredData = (pathname) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgency",
    name: "Hybrid Realty",
    description: "Premier real estate services and property investments",
    url: window.location.origin,
  };

  // Add route-specific structured data
  switch (pathname) {
    case "/":
      return {
        ...baseData,
        offers: {
          "@type": "AggregateOffer",
          description: "Property listings and investment opportunities",
        },
      };
    case "/properties":
      return {
        ...baseData,
        "@type": "SearchResultsPage",
        mainEntity: {
          "@type": "PropertySearch",
        },
      };
    default:
      return baseData;
  }
};

// Main App Component
const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;

// Sitemap Generation Utility (to be run during build process)
export const generateSitemap = async () => {
  const staticRoutes = [
    "/",
    "/properties",
    "/invest",
    "/lucky-draw",
    "/contact",
  ];

  // In a real implementation, fetch dynamic routes from your backend
  const dynamicRoutes = [
    // Example: '/properties/single/1',
    // '/properties/single/2', etc.
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticRoutes, ...dynamicRoutes]
    .map(
      (route) => `
    <url>
      <loc>${process.env.REACT_APP_SITE_URL}${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>${route === "/" ? "1.0" : "0.8"}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`;

  // In a real implementation, write to file system
  // fs.writeFileSync('./public/sitemap.xml', sitemap);
  return sitemap;
};
