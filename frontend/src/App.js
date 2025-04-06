import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Home from './pages/Home.jsx';
import {AuthProvider, useAuth} from './context/authContext.js';

const App = () => {
  const ProtectedRoute = ({children}) => {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />
    }

    return children;
  };

  const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    )
  }
  
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;