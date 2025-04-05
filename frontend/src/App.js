import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Promotions from './pages/Promotions'; // Changed from './pages/Promotions.jsx'

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/promotions" element={<Promotions />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;