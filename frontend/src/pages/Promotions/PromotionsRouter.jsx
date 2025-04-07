import React from 'react';
import { useAuth } from '../../context/authContext'; // Adjust the import path as necessary
import ManagerPromotions from './components/Manager/ManagerPromotions';
import RegularPromotions from './components/Regular/RegularPromotions';
const PromotionsRouter = () => {
  console.log("Rendering PromotionsRouter"); // Debugging line
  const { user } = useAuth();
  console.log("Current user:", user); // Debugging line
  console.log("User role:", user ? user.role : "No user"); // Debugging line
  // Check if user is a manager or admin
  const isManager = user && (user.role === 'manager' || user.role === 'superuser');
  
  // Render different components based on role
  return isManager ? <ManagerPromotions /> : <RegularPromotions />;
};

export default PromotionsRouter;