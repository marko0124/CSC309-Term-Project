import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ManagerEvents from './components/Manager/ManagerEvents';
import ManagerEventDetails from './components/Manager/ManagerEventDetails';
import OrganizerEventDetails from './components/Organizer/OrganizerEventDetails';
import DefaultEvents from './components/controller/DefaultEvents';
import RegularEventDetails from './components/RegularUser/RegularEventDetails';
// Fix the import path - remove the redundant "pages/Events" part
import EventDetailRouter from './components/EventDetailRouter';

const Events = () => {
    const location = useLocation();
    const path = location.pathname;
    
    console.log("Current path:", path);
    console.log("Is detail page:", path.match(/\/events\/\d+$/));
    
    if (path.match(/\/events\/\d+$/)) {
      const eventId = path.split('/').pop();
      console.log("Showing details for event ID:", eventId);
      return (
        <Routes>  
          <Route path="/events/:eventId" element={<EventDetailRouter />} />
        </Routes>
      );
    }
    
    console.log("Showing events list");
    return <DefaultEvents />;
};

export default Events;