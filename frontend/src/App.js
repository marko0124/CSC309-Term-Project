import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import AuthProvider from './context/authContext.js';

const App = () => {

  const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<LogIn />} />
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