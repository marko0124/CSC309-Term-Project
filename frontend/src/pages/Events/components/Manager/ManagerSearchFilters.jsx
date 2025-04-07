import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../Events.css';

const ManagerSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  locationTerm,
  setLocationTerm,
  activeButtons, 
  toggleFilterButton,
  onSearch,
  handleCreateClick,
  EventCount
}) => {
  return (
    <>
      <p className='event-header'>All Events ({EventCount || 0})</p>
      <div className='filter'>
        <input 
          type="text" 
          placeholder="Event Title" 
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Event Location" 
          className="location-bar"
          value={locationTerm}
          onChange={(e) => setLocationTerm(e.target.value)}
        />

        <button 
          type="button"
          className="search-button" 
          onClick={onSearch}
        >
          Search <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>
      
      <div className='filter-button-container'>
        <div className='button-filter'>
          <button 
            className={`filter-button ${activeButtons.showFull ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('showFull')}
          >
            Full
          </button>
          
          <button 
            className={`filter-button ${activeButtons.published ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('published')}
          >
            Published
          </button>
          
          <button 
            className={`filter-button ${activeButtons.started ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('started')}
          >
            Started
          </button>
          
          <button 
            className={`filter-button ${activeButtons.ended ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('ended')}
          >
            Ended
          </button>
        </div>
        <button 
          className="filter-button create" 
          onClick={() => {
            console.log('Create button clicked');
            handleCreateClick();
          }}
        >
          Create Event <FontAwesomeIcon icon={faPlus}/>
        </button>
      </div>
    </>
  );
};

export default ManagerSearchFilters;