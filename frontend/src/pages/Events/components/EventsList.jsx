import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './Events.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const EventsList = ({ 
  events, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onEventClick 
}) => {
  const [numGuests, setNumGuests] = useState(0);
  
  // Move the state update to useEffect
  useEffect(() => {
    // Check if events has a guests property
    if (events && events.guests) {
      setNumGuests(events.guests.length || 0);
    }
  }, [events]); 

  if (!events.results || events.results.length === 0) {
    return <div className="no-results">No Events Found :(</div>;
  }
  
  return (
    <>
      <div className='events'>
        {events.results.map((event, index) => (
          <ul className='event' key={event.id || index}>
            <div className='event-list-details'> 
              <div className='event-tag'>
                {event.capacity ? `Guest: ${event.numGuests || 0}/${event.capacity}` : `Unlimited`}
              </div>             
              <p>{new Date(event.startTime).toLocaleDateString()}</p>
            </div>
            <div 
              className="event-clickable"
              onClick={(e) => onEventClick(event, e)}
            >
              <div className="event-header">
                <div className='event-title'> 
                  {event.name || 'Event '} &nbsp;               
                </div>
                {event.published && <div className="icon" ><FontAwesomeIcon icon={faCircleCheck} /></div>}
              </div>
              
              <p className='event-description'>
                Attend {event.name} happening at {event.location || 0} for only {event.points || 0} points!
                Only available until {new Date(event.endTime).toLocaleDateString()}
              </p>
            </div>
            <div className='divider'></div>
          </ul>
        ))}
      </div>
      
      <Pagination 
        totalItems={events.count || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default EventsList;