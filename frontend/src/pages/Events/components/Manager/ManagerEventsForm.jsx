import React from 'react';

const EventForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  onCancel 
}) => {
  return (
    <>
      <div className="overlay" onClick={onCancel}></div>
      <div className="popup">
        <div className="popup-inner">
          <h2>Create New Event</h2>              
          <form onSubmit={handleSubmit}>
            <input 
              id="event-name"
              type="text" 
              name="name"
              placeholder="Event Name" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input 
              id="event-location"
              type="text" 
              name="location"
              placeholder="Event Location" 
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <textarea 
              id='event-description'
              name="description"
              placeholder="Event Description" 
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <div className="event-dates">

              <input
                id='promotion-start-time'
                type="date"
                name="startTime"
                placeholder="Start Time"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
              <input
                id='promotion-end-time'
                type="date"
                name="endTime"
                placeholder="End Time"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="event-extras">
              <input 
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleInputChange}
              />
              <input 
                type="number" 
                name="points"
                placeholder="Points" 
                value={formData.points}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div id="popup-buttons">
            <button className="popup-btn cancel-btn" onClick={onCancel}>Cancel</button>                
            <button className="popup-btn submit-btn" onClick={handleSubmit}>
              Create Event
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;