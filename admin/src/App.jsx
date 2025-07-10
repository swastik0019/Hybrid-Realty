import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorFallback from "./components/ErrorFallback";

// Pages
import Login from "./components/login";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import Update from "./pages/Update";
import Appointments from "./pages/Appointments";
import ApproveProperty from "./pages/ApproveProperty";
import PropertyDetails from "./pages/PropertyDetails";
import UserListPage from "./pages/UserListPage";
import UserDetailPage from "./pages/UserDetailPage";
import AdminLuckyDrawManagement from "./pages/AdminLuckyDrawManagement"; // Import Lucky Draw Management
import LuckyDrawPropertyDetails from "./pages/LuckyDrawPropertyDetails"; // Import Lucky Draw Property Details
import AdminUpcomingProjectsManagement from "./pages/AdminUpcomingProjectsManagement";
import UpcomingProjectDetails from "./pages/UpcomingProjectDetails";

// Config
// export const backendurl = 'https://hybridrealty-dev-backend.onrender.com';
// export const backendurl = import.meta.env.VITE_BACKEND_URL;

// export const backendurl = 'http://localhost:4000';
export const backendurl = '';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/list" element={<List />} />
                <Route path="/admin/approved" element={<ApproveProperty />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/update/:id" element={<Update />} />
                <Route path="/appointments" element={<Appointments />} />
                
                {/* New User Management Routes */}
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/:userId" element={<UserDetailPage />} />
                
                {/* Lucky Draw Management Routes */}
                <Route path="/admin/lucky-draw" element={<AdminLuckyDrawManagement />} />
                <Route path="/admin/upcoming-projects" element={<AdminUpcomingProjectsManagement />} />
                <Route path="/admin/lucky-draw/:id" element={<LuckyDrawPropertyDetails />} />
                <Route path="/admin/upcoming-projects/:id" element={<UpcomingProjectDetails />} />
                <Route path="/admin/hot-deals" element={<UpcomingProjectDetails />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        
        {/* Toast Notifications */}
        {/* <Toaster
           position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        /> */}
      </div>
    </ErrorBoundary>
  );
};

export default App;