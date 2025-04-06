import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Home from './pages/Home.jsx';
import Transactions from './pages/transactions/regular/index.js';
import SingleTransactionRegular from './pages/transactions/SingleTransaction.jsx';
import ManagerTransactions from './pages/transactions/manager/ManagerTransactions.jsx';
import RegularAllTransactions from './pages/transactions/regular/RegularAllTransactions.jsx';
import SingleTransactionManager from './pages/transactions/manager/SingleTransaction.jsx';


const App = () => {
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/transactions/manage" element={<ManagerTransactions/>} />
          <Route path="/transactions/all" element={<RegularAllTransactions />} />
          <Route path="/transactions/manage/:transactionId" element={<SingleTransactionManager />} />
          <Route path="/transactions" element={<Transactions/>} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
  );
};

export default App;