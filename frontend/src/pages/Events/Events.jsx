import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ManagerEvents from './Events/components/Manager/ManagerEvents';
import ManagerEventDetails from './Events/components/Manager/ManagerEventDetails';

const Events = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.match(/^\/events\/\d+$/);
  
  // This component will render either the list view or detail view
  // based on the current route
  return (
    <>
      {isDetailPage ? (
        <ManagerEventDetails />
      ) : (
        <ManagerEvents />
      )}
    </>
  );
};

export default Events;