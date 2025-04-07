import React from 'react';
import '../Events.css';
import './ManagerEventsForm.css'; // Add this import

const ManagerEventsForm = ({ 
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
          <h2>{formData.id ? 'Edit Event' : 'Create New Event'}</h2>              
          <form onSubmit={handleSubmit}>
            <div className="event-text">
              <div className="form-field">
                <label htmlFor="event-name">Event Name</label>
                <input 
                  id="event-name"
                  type="text" 
                  name="name"
                  placeholder="Enter event name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="event-location">Location</label>
                <input 
                  id="event-location"
                  type="text" 
                  name="location"
                  placeholder="Enter event location" 
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="create-event-description">
              <label htmlFor="event-description">Description</label>
              <textarea 
                id="event-description"
                name="description"
                placeholder="Provide details about your event" 
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <div className="event-dates">
              <div className="form-field"> 
                <label htmlFor="event-start-time">Start Time</label>
                <input
                  id="event-start-time"
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-field"> 
                <label htmlFor="event-end-time">End Time</label>
                <input
                  id="event-end-time"
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="event-capacity">Capacity (optional)</label>
                <input 
                  id="event-capacity"
                  className="event-capacity"
                  type="number"
                  name="capacity"
                  placeholder="Maximum attendees" 
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="event-points">Points</label>
                <input 
                  id="event-points"
                  className="event-points"
                  type="number" 
                  name="points"
                  placeholder="Points to award" 
                  value={formData.points}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div id="popup-buttons">
              <button type="button" className="popup-btn cancel-btn" onClick={onCancel}>
                Cancel
              </button>                
              <button type="submit" className="popup-btn submit-btn">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagerEventsForm;