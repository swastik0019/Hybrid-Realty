import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

// Lazy load components for performance
const Hero = React.lazy(() => import('../components/aboutus/Hero'))
const Mission = React.lazy(() => import('../components/aboutus/Mission'))
const Values = React.lazy(() => import('../components/aboutus/Values'))
const Team = React.lazy(() => import('../components/aboutus/Team'))
const Benefits = React.lazy(() => import('../components/aboutus/Benefit'))
const Milestones = React.lazy(() => import('../components/aboutus/Milestone'))

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        {/* Page Title */}
        <title>About Hybrid Realty - Our Story, Mission, and Values</title>
        
        {/* Meta Description */}
        <meta 
          name="description" 
          content="Learn about Hybrid Realty's journey, mission, and core values. Discover how we're revolutionizing real estate with innovative solutions and customer-centric approach."
        />
        
        {/* Keywords */}
        <meta 
          name="keywords" 
          content="about us, real estate company, our mission, company values, real estate team, property investment, company history"
        />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="About Hybrid Realty - Our Story, Mission, and Values" />
        <meta 
          property="og:description" 
          content="Learn about Hybrid Realty's journey, mission, and core values. Discover how we're revolutionizing real estate with innovative solutions and customer-centric approach."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta 
          property="og:image" 
          content="/about-og-image.jpg" 
        />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Hybrid Realty - Our Story, Mission, and Values" />
        <meta 
          name="twitter:description" 
          content="Learn about Hybrid Realty's journey, mission, and core values. Discover how we're revolutionizing real estate with innovative solutions and customer-centric approach."
        />
        <meta 
          name="twitter:image" 
          content="/about-og-image.jpg" 
        />
      </Helmet>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Hybrid Realty",
          "description": "A forward-thinking real estate company dedicated to providing exceptional property solutions",
          "url": window.location.origin,
          "foundingDate": "2025", // Replace with actual founding year
          "founders": [
            {
              "@type": "Person",
              "name": "Harsh" // Replace with actual founder names
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Hybrid Realty",
            "addressLocality": "New Delhi",
            "addressRegion": "Delhi",
            "postalCode": "110059",
            "addressCountry": "India"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+919911791469",
            "contactType": "Customer Service"
          },
          "sameAs": [
            "https://www.facebook.com/hybridrealty",
            "https://www.linkedin.com/company/hybridrealty",
            "https://www.instagram.com/hybridrealty"
          ]
        })}
      </script>

      {/* Page Content with Suspense for Performance */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="overflow-hidden">
          {/* <Hero />
          <Mission />
          <Values />
          <Team />
          <Benefits />
          <Milestones /> */}
        </div>
      </React.Suspense>
    </>
  )
}

export default About