import React from "react";
import { motion } from "framer-motion";

const PrivacySection = ({ title, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      <div className="text-gray-600 space-y-3">{children}</div>
    </motion.div>
  );
};

const Privacy = () => {
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
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Background elements */}
      {bgPattern}
      <div className="absolute top-20 right-0 w-80 h-80 bg-[var(--theme-color-1)]/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--theme-hover-color-1)]/10 rounded-full filter blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Privacy Policy
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-gray-600"
            >
              Your privacy is important to us. This policy outlines how we
              collect, use, and protect your information.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border-4 border-white mb-16"
          >
            <div className="prose prose-lg max-w-none">
              <PrivacySection title="1. Introduction" delay={0.2}>
                <p>
                  At Hybrid Realty, we respect your privacy and are committed to
                  protecting your personal data. This Privacy Policy will inform
                  you about how we look after your personal data when you visit
                  our website or use our services and tell you about your
                  privacy rights and how the law protects you.
                </p>
                <p>
                  Please read this Privacy Policy carefully to understand our
                  policies and practices regarding your personal data and how we
                  will treat it.
                </p>
              </PrivacySection>

              <PrivacySection title="2. Information We Collect" delay={0.3}>
                <p>
                  We collect several types of information from and about users
                  of our website and services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Identifiers:</strong> Name, email address,
                    telephone number, postal address, and other similar contact
                    information.
                  </li>
                  <li>
                    <strong>Account Information:</strong> Username, password,
                    account preferences, and settings.
                  </li>
                  <li>
                    <strong>Property Information:</strong> When you list, search
                    for, or inquire about properties, we collect information
                    about your property preferences, search history, and
                    interactions.
                  </li>
                  <li>
                    <strong>Financial Information:</strong> When you make
                    payments, we collect payment details, transaction
                    information, and billing data.
                  </li>
                  <li>
                    <strong>Usage Information:</strong> Details of your visits
                    to our website, including traffic data, location data, logs,
                    and other communication data and the resources that you
                    access and use.
                  </li>
                  <li>
                    <strong>Device Information:</strong> Information about your
                    computer, internet connection, IP address, operating system,
                    and browser type.
                  </li>
                </ul>
              </PrivacySection>

              <PrivacySection
                title="3. How We Collect Your Information"
                delay={0.4}
              >
                <p>We collect information in several ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Direct Interactions:</strong> Information you
                    provide when you register, fill out forms, create listings,
                    or communicate with us.
                  </li>
                  <li>
                    <strong>Automated Technologies:</strong> As you navigate
                    through our website, we may automatically collect technical
                    data about your equipment, browsing actions, and patterns.
                  </li>
                  <li>
                    <strong>Third Parties:</strong> We may receive information
                    about you from various third parties, such as business
                    partners, analytics providers, and search information
                    providers.
                  </li>
                </ul>
              </PrivacySection>

              <PrivacySection
                title="4. How We Use Your Information"
                delay={0.5}
              >
                <p>
                  We use the information we collect about you for various
                  purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing and improving our services</li>
                  <li>Processing and fulfilling your requests</li>
                  <li>Facilitating property transactions</li>
                  <li>Personalizing your experience</li>
                  <li>
                    Sending you updates about properties that match your
                    criteria
                  </li>
                  <li>Communicating with you about our services</li>
                  <li>
                    Analyzing usage patterns to improve our website and services
                  </li>
                  <li>Protecting the security and integrity of our platform</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </PrivacySection>

              <PrivacySection
                title="5. Cookies and Tracking Technologies"
                delay={0.6}
              >
                <p>
                  We use cookies and similar tracking technologies to track
                  activity on our website and hold certain information. Cookies
                  are files with a small amount of data which may include an
                  anonymous unique identifier.
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent. However, if you do not
                  accept cookies, you may not be able to use some portions of
                  our website.
                </p>
                <p>We use the following types of cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Necessary for the
                    website to function properly.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> Enable personalized
                    features and remember your preferences.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    visitors interact with our website.
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong> Used to deliver
                    relevant advertisements and track ad campaign performance.
                  </li>
                </ul>
              </PrivacySection>

              <PrivacySection
                title="6. Data Sharing and Disclosure"
                delay={0.7}
              >
                <p>
                  We may share your personal information in the following
                  situations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We may share your
                    information with third-party service providers who perform
                    services on our behalf, such as payment processing, data
                    analysis, email delivery, hosting services, and customer
                    service.
                  </li>
                  <li>
                    <strong>Property Partners:</strong> When you express
                    interest in a property, we may share your information with
                    the property owner, agent, or manager to facilitate the
                    transaction.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> If we are involved in a
                    merger, acquisition, or asset sale, your personal data may
                    be transferred.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> We may disclose your
                    information where required by law, regulation, or legal
                    process.
                  </li>
                  <li>
                    <strong>Protection of Rights:</strong> We may disclose
                    information to protect the rights, property, or safety of
                    Hybrid Realty, our users, or others.
                  </li>
                </ul>
              </PrivacySection>

              <PrivacySection title="7. Data Security" delay={0.8}>
                <p>
                  We have implemented appropriate security measures to prevent
                  your personal data from being accidentally lost, used,
                  accessed in an unauthorized way, altered, or disclosed. These
                  measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Secure network architecture</li>
                  <li>Regular backups and disaster recovery plans</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or
                  electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </PrivacySection>

              <PrivacySection title="8. Your Privacy Rights" delay={0.9}>
                <p>
                  Depending on your location, you may have certain rights
                  regarding your personal data, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access your personal data</li>
                  <li>The right to rectify inaccurate or incomplete data</li>
                  <li>The right to erasure (the "right to be forgotten")</li>
                  <li>The right to restrict processing of your data</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing</li>
                  <li>
                    Rights related to automated decision-making and profiling
                  </li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the
                  information provided in the "Contact Us" section.
                </p>
              </PrivacySection>

              <PrivacySection title="9. Children's Privacy" delay={1.0}>
                <p>
                  Our services are not intended for children under 18 years of
                  age. We do not knowingly collect personal information from
                  children under 18. If you are a parent or guardian and you
                  believe that your child has provided us with personal
                  information, please contact us immediately.
                </p>
              </PrivacySection>

              <PrivacySection
                title="10. International Data Transfers"
                delay={1.1}
              >
                <p>
                  We may process, store, and transfer your personal data in
                  countries other than your own. These countries may have
                  different data protection laws than your country of residence.
                </p>
                <p>
                  When we transfer your personal data to other countries, we
                  take appropriate safeguards to ensure that your personal data
                  remains protected in accordance with this Privacy Policy and
                  applicable law.
                </p>
              </PrivacySection>

              <PrivacySection
                title="11. Changes to Our Privacy Policy"
                delay={1.2}
              >
                <p>
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </PrivacySection>

              <PrivacySection title="12. Contact Us" delay={1.3}>
                <p>
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-xl mt-4">
                  <p className="font-semibold">Hybrid Realty - Privacy Team</p>
                  <p>Email: privacy@hybridrealty.com</p>
                  <p>Phone: +91 9876543210</p>
                  <p>Address: 123 Business Park, Mumbai, Maharashtra, India</p>
                </div>
              </PrivacySection>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">Last updated: April 19, 2025</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
