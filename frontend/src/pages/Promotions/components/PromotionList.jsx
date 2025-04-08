import React from 'react';
import Pagination from './Pagination';

const PromotionList = ({ 
  promotions, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onPromotionClick,
  isLoading = false // Add this prop with a default value
}) => {
  // Show loading indicator when data is being fetched
  if (isLoading) {
    return <div className="loading-promotions">Loading promotions...</div>;
  }
  
  // Only show "no results" when we're sure data has loaded and is empty
  if (!isLoading && (!promotions.results || promotions.results.length === 0)) {
    return <div className="no-results">No promotions available :(</div>;
  }
  
  return (
    <>
      <div className='promotions'>
        {promotions.results.map((promotion, index) => (
          <ul className='promotion' key={promotion.id || index}>
            <div className='promotion-details'> 
              <div className='promotion-tag'>{promotion.type}</div> 
              <p>{new Date(promotion.startTime).toLocaleDateString()}</p>
            </div>
            <div 
              className="promotion-clickable"
              onClick={(e) => onPromotionClick(promotion, e)}
            >
              <div className='promotion-title'>{promotion.name || 'Some title'}</div>
              <p className='promotion-description'>
                Get a discount of {promotion.rate} at a minimum spending of {promotion.minSpending || 0}! 
                Only available until {new Date(promotion.endTime).toLocaleDateString()}
              </p>
            </div>
            <div className='divider'></div>
          </ul>
        ))}
      </div>
      
      <Pagination 
        totalItems={promotions.count || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default PromotionList;