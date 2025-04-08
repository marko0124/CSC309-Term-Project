import React from 'react';
import { useAuth } from '../../context/authContext';
import ManagerPromotions from "./components/Manager/ManagerPromotions";
import RegularPromotions from "./components/Regular/RegularPromotions";

const Promotions = () => {
  const { user } = useAuth();
  console.log("Current user:", user); // Debugging line
  console.log("User role:", user ? user.role : "No user"); // Debugging line
  console.log("Current user:", user); // Add this for debugging
  
  // Check if user is a manager or admin
  const isManager = user && (user.role === 'manager' || user.role === 'admin');
  
  console.log("Is manager:", isManager); // Add this for debugging
  
  return isManager ? <ManagerPromotions /> : <RegularPromotions />;
}

export default Promotions;