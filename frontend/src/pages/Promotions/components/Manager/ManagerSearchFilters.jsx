import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

const ManagerSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  activeButtons, 
  toggleFilterButton,
  onSearch,
  onCreateClick,
  promotionCount
}) => {
  return (
    <>
      <p className='promotion-header'>All Promotions ({promotionCount || 0})</p>
      <div className="all-filters-promotions">
        <div className='filter'>
          <input 
            type="text" 
            placeholder="Search for a promotion" 
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              className={`promotion-filter-button ${activeButtons.oneTime ? 'active-filter-button' : ''}`}
              onClick={() => toggleFilterButton('oneTime')}
            >
              One-Time
            </button>
            
            <button 
              className={`promotion-filter-button ${activeButtons.automatic ? 'active-filter-button' : ''}`}
              onClick={() => toggleFilterButton('automatic')}
            >
              Automatic
            </button>
            
            <button 
              className={`promotion-filter-button ${activeButtons.started ? 'active-filter-button' : ''}`}
              onClick={() => toggleFilterButton('started')}
            >
              Started
            </button>
            
            <button 
              className={`promotion-filter-button ${activeButtons.ended ? 'active-filter-button' : ''}`}
              onClick={() => toggleFilterButton('ended')}
            >
              Ended
            </button>
          </div>
          <button className='promotion-filter-button create' onClick={onCreateClick}>
            Create Promotion <FontAwesomeIcon icon={faPlus}/>
          </button>
        </div>
      </div>
    </>
  );
};

export default ManagerSearchFilters;