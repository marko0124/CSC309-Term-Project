import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Home from './pages/Home.jsx';
import Transactions from './pages/transactions';
import SingleTransaction from './pages/transactions/SingleTransaction.jsx';

const App = () => {
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/transactions/:transactionId" element={<SingleTransaction/>} />
          <Route path="/transactions" element={<Transactions/>} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
  );
};

export default App;