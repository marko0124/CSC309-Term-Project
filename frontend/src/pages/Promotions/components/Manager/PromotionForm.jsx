import React from 'react';

const PromotionForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  editMode, 
  onCancel,
  validationErrors
}) => {
  return (
    <>
      <div className="overlay" onClick={onCancel}></div>
      <div className="create-popup">
        <div className="create-popup-inner">
          <h2>{editMode ? 'Edit Promotion' : 'Create New Promotion'}</h2>              
          <form onSubmit={handleSubmit}>
            <input 
              id="promotion-title"
              type="text" 
              name="title"
              placeholder="Promotion Title" 
              value={formData?.title} // Add fallback with optional chaining
              onChange={handleInputChange}
              required
            />
            <textarea 
              id='promotion-description'
              name="description"
              placeholder="Promotion Description" 
              value={formData?.description} // Add fallback
              onChange={handleInputChange}
              required
            ></textarea>
            <div className="promotion-dates">
              <select 
                id="promotion-type" 
                name="promotionType" 
                value={formData?.promotionType || 'one-time'}
                onChange={handleInputChange}
                required
              >
                <option value="one-time">One-Time</option>
                <option value="automatic">Automatic</option>
              </select>

              <input
                id='promotion-start-date'
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={formData?.startDate}
                onChange={handleInputChange}
                required
              />
              <input
                id='promotion-end-date'
                type="date"
                name="endDate"
                placeholder="End Date"
                value={formData?.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="promotion-unrequired">
              <input 
                type="number"
                name="minSpending"
                placeholder="Minimum Spending"
                value={formData?.minSpending || ''}
                onChange={handleInputChange}
              />

              <input
                type="number"
                name="rate"
                placeholder="Discount Rate"
                value={formData?.rate || ''}
                onChange={handleInputChange}
              />
              <input 
                type="number" 
                name="points"
                placeholder="Points" 
                value={formData?.points || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="create-popup-buttons">
            <button className="popup-btn cancel-btn" onClick={onCancel}>Cancel</button>                
            <button className="popup-btn submit-btn">
              {editMode ? 'Edit Promotion' : 'Create New Promotion'}
            </button>
          </div>
          </form>
          
        </div>
      </div>
    </>
  );
};

export default PromotionForm;