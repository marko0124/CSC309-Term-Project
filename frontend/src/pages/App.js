import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/authContext.js';
import EventDetailRouter from './Events/EventDetailRouter.jsx';
import EventsRouter from './Events/EventsRouter.jsx';
import LogIn from './LogIn.jsx';
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
    
    // Add this missing return statement
    return <Navigate to="/unauthorized" replace />;
  };

  const AppRoutes = () => {
    return (
      <Routes>
        
        <Route
          path="/"
          element={
              <LogIn />
          }
        />
        
        <Route
          path="/events"
          element={
              <EventsRouter />
          }
        />

        <Route
          path="/events/:eventId"
          element={
              <EventDetailRouter />
          }
        />

      </Routes>
    );
  };
  
  // Add this missing return statement
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};
  
export default App;