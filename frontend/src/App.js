import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LogIn from './pages/LogIn.jsx';
import Home from './pages/Home.jsx';
import Transactions from './pages/transactions';
import SingleTransaction from './pages/transactions/SingleTransaction.jsx';
import Forbidden from './pages/errors/Forbidden.jsx';
import NotFound from './pages/errors/NotFound.jsx';
import RequireAuth from './components/RequireAuth.js';

const App = () => {

  return (
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<LogIn />} />

          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={["regular", "cashier", "manager", "superuser"]} />}>
            <Route path="/" element={<Home/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["manager", "superuser"]} />}>
            <Route path="/transactions/:transactionId" element={<SingleTransaction/>} />
            <Route path="/transactions" element={<Transactions/>} />
          </Route>

          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
  );
};

export default App;