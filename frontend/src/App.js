import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Promotions from './pages/Promotions.jsx';
import Events from './pages/Events';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/events" element={<Events />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;