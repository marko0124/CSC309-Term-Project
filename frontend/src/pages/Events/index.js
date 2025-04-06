import React from 'react';
import { useLocation } from 'react-router-dom';
import ManagerEvents from './components/Manager/ManagerEvents';
import ManagerEventDetails from './components/Manager/ManagerEventDetails';

const Events = () => {
    const location = useLocation();
    const path = location.pathname;
    
    console.log("Current path:", path);
    console.log("Is detail page:", path.match(/\/events\/\d+$/));
    
    if (path.match(/\/events\/\d+$/)) {
      const eventId = path.split('/').pop();
      console.log("Showing details for event ID:", eventId);
      return <ManagerEventDetails eventId={eventId} />;
    }
    
    console.log("Showing events list");
    return <ManagerEvents />;
  };

export default Events;