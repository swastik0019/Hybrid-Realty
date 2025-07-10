import React from "react";
import { motion } from "framer-motion";

const TermsSection = ({ title, children, delay = 0 }) => {
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

const Terms = () => {
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
              Terms and Conditions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-gray-600"
            >
              Please read these terms carefully before using our services.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border-4 border-white mb-16"
          >
            <div className="prose prose-lg max-w-none">
              <TermsSection title="1. Introduction" delay={0.2}>
                <p>
                  Welcome to Hybrid Realty. These Terms and Conditions govern
                  your use of our website, mobile applications, and services
                  (collectively, the "Services"). By accessing or using our
                  Services, you agree to be bound by these Terms. If you
                  disagree with any part of these terms, you may not access the
                  Services.
                </p>
              </TermsSection>

              <TermsSection title="2. Definitions" delay={0.3}>
                <p>
                  <strong>"User"</strong> refers to individuals who access or
                  use our Services.
                </p>
                <p>
                  <strong>"Content"</strong> means any information, data, text,
                  software, graphics, messages, tags, or other materials
                  available through our Services.
                </p>
                <p>
                  <strong>"Listing"</strong> refers to any property or real
                  estate listing provided through our Services.
                </p>
              </TermsSection>

              <TermsSection title="3. Use of Services" delay={0.4}>
                <p>
                  Our Services are intended solely for users to explore real
                  estate opportunities and connect with property sellers,
                  buyers, or agents. You agree to use our Services only for
                  lawful purposes and in accordance with these Terms.
                </p>
                <p>You are prohibited from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Using our Services to violate any applicable law or
                    regulation
                  </li>
                  <li>Posting false or misleading information</li>
                  <li>Impersonating any person or entity</li>
                  <li>
                    Interfering with or disrupting the Services or servers
                  </li>
                  <li>
                    Attempting to gain unauthorized access to any parts of the
                    Services
                  </li>
                </ul>
              </TermsSection>

              <TermsSection title="4. Property Listings" delay={0.5}>
                <p>
                  The property listings on our Services are provided by
                  third-party sellers, agents, or partners. While we strive to
                  ensure the accuracy of listings, we do not guarantee the
                  accuracy, completeness, or quality of any listings or Content
                  on our Services.
                </p>
                <p>
                  We recommend that users conduct their own due diligence before
                  making any real estate decisions based on the information
                  provided through our Services.
                </p>
              </TermsSection>

              <TermsSection title="5. User Accounts" delay={0.6}>
                <p>
                  When you create an account with us, you must provide accurate,
                  complete, and current information. You are responsible for
                  safeguarding your password and for all activities that occur
                  under your account.
                </p>
                <p>
                  You agree to notify us immediately of any unauthorized use of
                  your account or any other breach of security. We cannot and
                  will not be liable for any loss or damage arising from your
                  failure to comply with this section.
                </p>
              </TermsSection>

              <TermsSection title="6. Intellectual Property" delay={0.7}>
                <p>
                  The Services and its original content, features, and
                  functionality are and will remain the exclusive property of
                  Hybrid Realty and its licensors. The Services are protected by
                  copyright, trademark, and other laws.
                </p>
                <p>
                  Our trademarks and trade dress may not be used in connection
                  with any product or service without the prior written consent
                  of Hybrid Realty.
                </p>
              </TermsSection>

              <TermsSection title="7. Privacy Policy" delay={0.8}>
                <p>
                  Your use of our Services is also governed by our Privacy
                  Policy, which is incorporated into these Terms by reference.
                  Please review our Privacy Policy to understand our practices.
                </p>
              </TermsSection>

              <TermsSection title="8. Limitation of Liability" delay={0.9}>
                <p>
                  In no event shall Hybrid Realty, its officers, directors,
                  employees, or agents be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Your access to or use of or inability to access or use the
                    Services
                  </li>
                  <li>
                    Any conduct or content of any third party on the Services
                  </li>
                  <li>Any content obtained from the Services</li>
                  <li>
                    Unauthorized access, use, or alteration of your
                    transmissions or content
                  </li>
                </ul>
              </TermsSection>

              <TermsSection title="9. Termination" delay={1.0}>
                <p>
                  We may terminate or suspend your account and bar access to the
                  Services immediately, without prior notice or liability, for
                  any reason whatsoever, including without limitation if you
                  breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Services will
                  immediately cease. If you wish to terminate your account, you
                  may simply discontinue using the Services.
                </p>
              </TermsSection>

              <TermsSection title="10. Governing Law" delay={1.1}>
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of India, without regard to its conflict of law
                  provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights. If any
                  provision of these Terms is held to be invalid or
                  unenforceable by a court, the remaining provisions of these
                  Terms will remain in effect.
                </p>
              </TermsSection>

              <TermsSection title="11. Changes to Terms" delay={1.2}>
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. We will provide notice prior
                  to any new terms taking effect. What constitutes a material
                  change will be determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our Services after those
                  revisions become effective, you agree to be bound by the
                  revised terms. If you do not agree to the new terms, please
                  stop using the Services.
                </p>
              </TermsSection>

              <TermsSection title="12. Contact Us" delay={1.3}>
                <p>
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="bg-gray-50 p-6 rounded-xl mt-4">
                  <p className="font-semibold">Hybrid Realty</p>
                  <p>Email: legal@hybridrealty.com</p>
                  <p>Phone: +91 9876543210</p>
                  <p>Address: 123 Business Park, Mumbai, Maharashtra, India</p>
                </div>
              </TermsSection>
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

export default Terms;
