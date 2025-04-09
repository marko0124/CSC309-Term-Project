import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const UserSearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  activeButtons, 
  toggleFilterButton,
  onSearch,
  userCount
}) => {
  return (
    <>
      <p className='user-header'>All Users ({userCount || 0})</p>
      <div className='filter'>
        <input 
          type="text" 
          placeholder="Search by name or UTORid" 
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button 
          type="button"
          className="search-button" 
          onClick={onSearch}
        >
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>
      
      <div className='filter-button-container'>
        <div className='button-filter'>
          <button 
            className={`filter-button ${activeButtons.regular ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('regular')}
          >
            Regular
          </button>
          
          <button 
            className={`filter-button ${activeButtons.cashier ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('cashier')}
          >
            Cashier
          </button>

          <button 
            className={`filter-button ${activeButtons.manager ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('manager')}
          >
            Manager
          </button>

          <button 
            className={`filter-button ${activeButtons.superuser ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('superuser')}
          >
            Superuser
          </button>
          
          <button 
            className={`filter-button ${activeButtons.verified ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('verified')}
          >
            Verified
          </button>
          
          <button 
            className={`filter-button ${activeButtons.activated ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('activated')}
          >
            Activated
          </button>

          <button 
            className={`filter-button ${activeButtons.activated ? 'active-filter-button' : ''}`}
            onClick={() => toggleFilterButton('bookmarked')}
          >
            Bookmarked
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSearchFilters;