import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Promotions from './pages/Promotions.jsx';
import ManagerEvents from './pages/Events/components/Manager/ManagerEvents';
import ManagerEventDetails from './pages/Events/components/Manager/ManagerEventDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/events" element={<ManagerEvents />} />
        <Route path="/events/:eventId" element={<ManagerEventDetails />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;