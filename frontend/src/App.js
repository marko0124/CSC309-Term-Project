import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Events from './pages/Events'; // Make sure to import Events
import Users from './pages/Users'; // Add this import 
import CreateUser from './pages/CreateUser'; // Add this import
import { AuthProvider, useAuth } from './context/authContext.js';
import AccessDenied from './pages/AccessDenied'; // Create this component

const App = () => {
  // Role-based protected route
  const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    // If no roles specified, allow any authenticated user
    if (allowedRoles.length === 0) {
      return children;
    }

    // Check if user has one of the allowed roles
    if (user && allowedRoles.includes(user.role)) {
      return children;
    }

    // User doesn't have permission
    return <Navigate to="/access-denied" replace />;
  };

  const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<LogIn />} />
        
        {/* Organizer specific routes */}
        <Route
          path="/promotions"
          element={
            <RoleBasedRoute allowedRoles={['manager', 'superuser']}>
              <ManagerPromotions />
            </RoleBasedRoute>
          }
        />
        
        {/* Access denied page */}
        <Route path="/access-denied" element={<AccessDenied />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  };
  
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;