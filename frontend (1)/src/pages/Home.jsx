// import { userInfo } from 'os'
import React from 'react'
import { Helmet } from 'react-helmet-async'

// Lazy load components for performance
const Hero = React.lazy(() => import('../components/Hero'))
const Properties = React.lazy(() => import('../components/propertiesshow'))
const FeaturedInvestedProperties = React.lazy(() => import('../components/properties/FeaturedInvestedProperties'))
const Steps = React.lazy(() => import('../components/Steps'))


// console.log(userInfo); 
const Home = () => {
  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        {/* Page Title */}
        <title>Hybrid Realty - Your Dream Property Awaits</title>
        
        {/* Meta Description */}
        <meta 
          name="description" 
          content="Discover your perfect property with Hybrid Realty. Browse our featured properties, investment opportunities, and find your dream home or investment today."
        />
        
        {/* Keywords */}
        <meta 
          name="keywords" 
          content="real estate, property listings, investment properties, luxury homes, real estate investment, property search"
        />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Hybrid Realty - Your Dream Property Awaits" />
        <meta 
          property="og:description" 
          content="Discover your perfect property with Hybrid Realty. Browse our featured properties, investment opportunities, and find your dream home or investment today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta 
          property="og:image" 
          content="/og-image.jpg" 
        />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hybrid Realty - Your Dream Property Awaits" />
        <meta 
          name="twitter:description" 
          content="Discover your perfect property with Hybrid Realty. Browse our featured properties, investment opportunities, and find your dream home or investment today."
        />
        <meta 
          name="twitter:image" 
          content="/og-image.jpg" 
        />
      </Helmet>

      {/* Page Content with Suspense for Performance */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <div>
          <Hero />
          <Properties />
          <FeaturedInvestedProperties />
          <Steps />
        </div>
      </React.Suspense>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateWebsite",
          "name": "Hybrid Realty",
          "description": "Your trusted partner in finding the perfect property",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/properties?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "offers": {
            "@type": "AggregateOffer",
            "description": "Explore our wide range of property listings and investment opportunities"
          }
        })}
      </script>
    </>
  )
}

export default Home