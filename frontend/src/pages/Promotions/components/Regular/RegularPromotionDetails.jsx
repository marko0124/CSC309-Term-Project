import React from 'react';

const RegularPromotionDetails = ({ 
  promotion, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="detail-popup">
        <div className="detail-popup-inner">
          <div className="detail-popup-header">
            <div><h2>{promotion.name}</h2></div>
            <div>
              <div className="detail-popup-promotion-tag">{promotion.type}</div>
              <div className="popup-dates">
                {new Date(promotion.startTime).toLocaleDateString()} - {new Date(promotion.endTime).toLocaleDateString()}
              </div>
            </div>
          </div>

          {promotion.loading ? (
            <div className="loading-spinner">Loading details...</div>
          ) : (
            <div className="promotion-details-popup">
              <p>Discount Rate: {promotion.rate || 'N/A'}</p>
              <p>Minimum Spending: ${promotion.minSpending || 0}</p>
              <p>Points: {promotion.points || 'N/A'}</p>                  
              <h3>Promotion Description</h3>
              <div className="promotion-detail-description">{promotion.description}</div>
            </div>
          )}
          
          <div id="detail-popup-buttons">
            <button className="popup-btn cancel-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegularPromotionDetails;