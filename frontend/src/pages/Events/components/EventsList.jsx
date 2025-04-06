import React from 'react';
import Pagination from './Pagination';

const EventsList = ({ 
  events, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onEventClick 
}) => {
  if (!events.results || events.results.length === 0) {
    return <div className="no-results">No Events Found :(</div>;
  }
  
  return (
    <>
      <div className='events'>
        {events.results.map((event, index) => (
          <ul className='event' key={event.id || index}>
            <div className='event-details'> 
              <div className='event-tag'>
                {event.capacity ? `Guest: ${event.numGuests || 0}/${event.capacity}` : `Unlimited`}
              </div>             
              <p>{new Date(event.startTime).toLocaleDateString()}</p>
            </div>
            <div 
              className="event-clickable"
              onClick={(e) => onEventClick(event, e)}
            >
              <div className='event-title'>{event.name || 'Some title'}</div>
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