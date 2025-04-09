import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components

import RegularTransactions from './pages/transactions/regular/index.js';

import ManagerTransactions from './pages/transactions/manager/ManagerTransactions.jsx';
import RegularAllTransactions from './pages/transactions/regular/RegularAllTransactions.jsx';

import CashierTransactions from './pages/transactions/cashier/index.jsx';
import CreatePurchasePage from './pages/transactions/cashier/CreatePurchasePage.jsx';
import ProcessRedemptionPage from './pages/transactions/cashier/ProcessRedemptionPage.jsx';

import LogIn from './pages/login/LogIn.jsx';
import UserProfile from './pages/profile/UserProfile.jsx';
import ChangePassword from './pages/profile/ChangePassword.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/users/Users.jsx';
import CreateUser from './pages/users/CreateUser.jsx';
import PromotionsRouter from './pages/Promotions/PromotionsRouter.jsx';
import {AuthProvider, useAuth} from './context/authContext.js';
import SingleTransactionRegular from './pages/transactions/regular/SingleTransactionRegular.jsx';
import SingleTransactionManager from './pages/transactions/manager/SingleTransactionManager.jsx';
import RequestRedemptionPage from './pages/transactions/regular/RequestRedemptionPage.jsx';
import TransferPointsPage from './pages/transactions/regular/TransferPointsPage.jsx';
import EventDetailRouter from './pages/Events/EventDetailRouter.jsx';
import EventsRouter from './pages/Events/EventsRouter.jsx';

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
          path="/home/manager"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/cashier"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/regular"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/superuser"
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
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        {/* transactions */}
        <Route
          path="/transactions/manage/all"
          element={
            <ProtectedRoute>
              <ManagerTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/manage/:transactionId"
          element={
            <ProtectedRoute>
              <SingleTransactionManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/cashier/processRedemption"
          element={
            <ProtectedRoute>
              <ProcessRedemptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/cashier/create"
          element={
            <ProtectedRoute>
              <CreatePurchasePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/cashier"
          element={
            <ProtectedRoute>
              <CashierTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/all"
          element={
            <ProtectedRoute>
              <RegularAllTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/redeem"
          element={
            <ProtectedRoute>
              <RequestRedemptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/transfer"
          element={
            <ProtectedRoute>
              <TransferPointsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:transactionId"
          element={
            <ProtectedRoute>
              <SingleTransactionRegular />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <RegularTransactions />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/promotions"
          element={
            <ProtectedRoute>
              <PromotionsRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsRouter />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetailRouter />
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