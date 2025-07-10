import React from 'react'
import PropertiesPage from '../components/properties/Propertiespage'
import { Helmet } from 'react-helmet-async'

const Properties = () => {
  return (


    <>
    <Helmet>
      {/* Page Title */}
      <title>Browse Properties | Hybrid Realty - Find Your Dream Home</title>
      
      {/* Meta Description */}
      <meta 
        name="description" 
        content="Discover a wide range of properties for sale and rent. Browse through our extensive collection of houses, apartments, villas, and commercial spaces. Find your perfect property with Hybrid Realty."
      />
      
      {/* Keywords */}
      <meta 
        name="keywords" 
        content="property listings, houses for sale, apartments for rent, real estate, property search, buy home, rent property, residential properties, commercial spaces"
      />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content="Browse Properties | Hybrid Realty - Find Your Dream Home" />
      <meta 
        property="og:description" 
        content="Discover a wide range of properties for sale and rent. Browse through our extensive collection of houses, apartments, villas, and commercial spaces. Find your perfect property with Hybrid Realty."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta 
        property="og:image" 
        content="/properties-og-image.jpg" 
      />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Browse Properties | Hybrid Realty - Find Your Dream Home" />
      <meta 
        name="twitter:description" 
        content="Discover a wide range of properties for sale and rent. Browse through our extensive collection of houses, apartments, villas, and commercial spaces. Find your perfect property with Hybrid Realty."
      />
      <meta 
        name="twitter:image" 
        content="/properties-og-image.jpg" 
      />
    </Helmet>


<script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Property Listings",
        "description": "Comprehensive real estate listing platform with diverse property options",
        "mainEntity": {
          "@type": "SearchResultsPage",
          "description": "Search and filter through various residential and commercial properties",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/properties?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hybrid Realty",
          "url": window.location.origin,
          "logo": "/logo.jpg"
        }
      })}
    </script>


    
    <div>
      <PropertiesPage />
    </div>
    </>
  )
}

export default Properties




