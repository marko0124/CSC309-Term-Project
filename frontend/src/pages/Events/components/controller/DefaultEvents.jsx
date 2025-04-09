import React, { useState } from 'react';
import '../Events.css';
import '../../../navbar.css'; 
import useEvents from '../../hooks/useEvents';
import RegularSearchFilter from '../controller/RegularSearchFilter';
import EventsList from '../EventsList';
import eventImage from '../../../../assets/eventImage.png'; 
import HomeNavbar from '../../../navbar/HomeNavbar';


const DefaultEvents = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const {
    events,
    loading,
    currentPage,
    itemsPerPage,
    searchTerm,
    activeButtons,
    setButtonPopup,
    setLocationTerm,
    locationTerm,
    setSearchTerm,
    handleSearch,
    handlePageChange,
    handleEventClick,
    toggleFilterButton,
  } = useEvents();

  const fullDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const truncatedDescription = fullDescription.substring(0, 100) + "...";

  if (loading) return <div>Loading...</div>;

  return (
    <div className='events-page'>
      <main>
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        <HomeNavbar> </HomeNavbar>

        
        {/* Header Section */}
        <div className='header-container'> 
          <div className='header-text'>
            <h1>A Title of the most Important Upcoming Event</h1>
            <div className='header-text-details'>
              <p className='event-tag'>some type</p>
              <p> Some Date</p>
            </div>
            <div className='expandable-text'>
              <p className='header-text-description'>
                {showFullDescription ? fullDescription : truncatedDescription}
              </p>
              <button 
                className='show-more-button'
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
          <div className='header-image'>
            <img className='himg' src={eventImage} alt="event" />
          </div>
        </div>
      
        <div className="custom-shape-divider-top-1743545933">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
        
        {/* Main Content */}
        <div className='events-list-container'>
          <div className='events-list'> 
            <RegularSearchFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationTerm={locationTerm}
              setLocationTerm={setLocationTerm}
              activeButtons={activeButtons}
              toggleFilterButton={toggleFilterButton}
              onSearch={handleSearch}
              onCreateClick={() => setButtonPopup(true)}
              EventCount={events.count}
            />
            
            <EventsList 
              events={events}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
        
        <div className='footer'>Footer</div>
      </main>
    </div>
  );
};

export default DefaultEvents;