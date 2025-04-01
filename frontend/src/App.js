import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;