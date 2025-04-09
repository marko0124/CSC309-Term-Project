import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as eventService from '../../services/eventService';
import '../controller/ParticipantPopup.css';

const ParticipantPopup = ({ 
  trigger, 
  setTrigger, 
  eventGuests = [], 
  eventOrganizers = [],
  eventId,
  onUpdateParticipants
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newGuest, setNewGuest] = useState('');
  const [newOrganizer, setNewOrganizer] = useState({utorid: '' });
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddOrganizer, setShowAddOrganizer] = useState(false);

  const handleRemoveOrganizer = async (id) => {
    if (!window.confirm(`Are you sure you want to remove this organizer?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Make sure to use the correctly named function
      await eventService.deleteOrganizer(eventId, id);
      
      setSuccess('Organizer removed successfully!');
      
      // Call the callback to refresh the parent component
      if (onUpdateParticipants) {
        onUpdateParticipants();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error removing organizer:', error);
      setError(error.message || 'Failed to remove organizer');
    } finally {
      setLoading(false);
    }
  };
  const handleAddOrganizer = async (e) => {
    e.preventDefault();
    
    if (!newOrganizer.utorid.trim()) {
      setError('Please enter a UTORid');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await eventService.addOrganizer(eventId, newOrganizer.utorid);
      
      setSuccess('Organizer added successfully!');
      setNewOrganizer({ utorid: '' });
      setShowAddOrganizer(false);
      
      // Call the callback to refresh the parent component
      if (onUpdateParticipants) {
        onUpdateParticipants();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding organizer:', err);
      setError(err.message || 'Failed to add organizer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    
    if (!newGuest.trim()) {
      setError('Please enter a UTORid');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Adding guest with UTORid:', newGuest, 'to event:', eventId);
      await eventService.addGuest(eventId, newGuest);
      
      setSuccess('Guest added successfully!');
      setNewGuest('');
      setShowAddGuest(false);
      
      // Call the callback to refresh the parent component
      if (onUpdateParticipants) {
        onUpdateParticipants();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding guest:', error);
      setError(error.message || 'Failed to add guest');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGuest = async (id) => {
    if (!window.confirm(`Are you sure you want to remove this guest?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await eventService.deleteGuest(eventId, id);
      
      setSuccess('Guest removed successfully!');
      
      // Call the callback to refresh the parent component
      if (onUpdateParticipants) {
        onUpdateParticipants();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message || 'Failed to remove guest');
    } finally {
      setLoading(false);
    }
  };

  return trigger ? (
    <div className="popup-overlay">
      <div className="participant-popup">
        <div className="participant-popup-inner">
          <h2>Event Participants</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="participants-container">
            {/* Organizers Section */}
            <div className="participants-section">
              <h3>Event Organizers</h3>
              
            {eventOrganizers && eventOrganizers.length > 0 ? (
              <ul className="participants-list">
                {eventOrganizers.map((organizer, index) => (
                  <li key={index} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">{organizer.name || 'Unknown'}</span>
                      <span className="participant-utorid">{organizer.utorid}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveOrganizer(organizer.id)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-participants">No organizers found</div>
            )}
              
              {/* Add Organizer Button */}
              {!showAddOrganizer ? (
                <button 
                  className="add-participant-btn"
                  onClick={() => setShowAddOrganizer(true)}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Add Organizer
                </button>
              ) : (
                <form className="add-participant-form" onSubmit={handleAddOrganizer}>
                  <div className="form-header">
                    <h4>Add New Organizer</h4>
                    <button 
                      type="button" 
                      className="close-form-btn"
                      onClick={() => setShowAddOrganizer(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter UTORid"
                    value={newOrganizer.utorid}
                    onChange={(e) => setNewOrganizer({ utorid: e.target.value })}
                    required
                  />
                  
                  <button 
                    type="submit" 
                    className="add-btn"
                    disabled={loading}
                  >
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Add Organizer'}
                  </button>
                </form>
              )}
            </div>
            
            {/* Guests Section */}
            <div className="participants-section">
              <h3>Event Guests</h3>
              
              {eventGuests && eventGuests.length > 0 ? (
                <ul className="participants-list">
                  {eventGuests.map((guest, index) => (
                    <li key={index} className="participant-item">
                      <div className="participant-info">
                        <span className="participant-name">{guest.name || 'Unknown'}</span>
                        <span className="participant-utorid">{guest.utorid}</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveGuest(guest.id)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-participants">No guests found</div>
              )}
              
              {/* Add Guest Button */}
              {!showAddGuest ? (
                <button 
                  className="add-participant-btn"
                  onClick={() => setShowAddGuest(true)}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Add Guest
                </button>
              ) : (
                <form className="add-participant-form" onSubmit={handleAddGuest}>
                  <div className="form-header">
                    <h4>Add New Guest</h4>
                    <button 
                      type="button" 
                      className="close-form-btn"
                      onClick={() => setShowAddGuest(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter UTORid"
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    required
                  />
                  
                  <button 
                    type="submit" 
                    className="add-btn"
                    disabled={loading}
                  >
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Add Guest'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <button
            className="close-popup-btn"
            onClick={() => {
              setTrigger(false);
              if (onUpdateParticipants) {
                onUpdateParticipants();
              }
            }}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ParticipantPopup;