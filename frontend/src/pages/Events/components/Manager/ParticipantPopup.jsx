import React, { useState } from 'react';
import './ParticipantPopup.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as eventService from '../../services/eventService'; 

const ParticipantPopup = ({ 
  trigger, 
  setTrigger, 
  eventGuests, 
  eventOrganizers,
  eventId,
  onUpdateParticipants
}) => {
  const [showAddOrganizer, setShowAddOrganizer] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({ utorid: '' });
  const [newGuest, setNewGuest] = useState({ utorid: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddOrganizer = async (e) => {
    e.preventDefault();
    
    if (!newOrganizer.utorid) {
      setError('UtorId is required');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      await eventService.addOrganizer(eventId, newOrganizer.utorid);
      
      // Refresh data
      setNewOrganizer({ utorid: '' });
      setShowAddOrganizer(false);
      if (onUpdateParticipants) onUpdateParticipants();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new guest
  const handleAddGuest = async (e) => {
    e.preventDefault();
    
    if (!newGuest.utorid) { // FIXED: was checking newOrganizer instead of newGuest
      setError('UtorId is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await eventService.addGuest(eventId, newGuest.utorid);
      
      // Refresh data
      setNewGuest({ utorid: '' });
      setShowAddGuest(false);
      if (onUpdateParticipants) onUpdateParticipants();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an organizer
  const handleDeleteOrganizer = async (organizerId) => { // FIXED: removed extra eventId parameter
    if (!window.confirm('Are you sure you want to remove this organizer?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await eventService.deleteOrganizer(eventId, organizerId);
      
      // Refresh data
      if (onUpdateParticipants) onUpdateParticipants();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting a guest
  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Are you sure you want to remove this guest?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await eventService.deleteGuest(eventId, guestId);
      
      // Refresh data
      if (onUpdateParticipants) onUpdateParticipants();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (trigger) ? (
    <div className="popup-overlay">
      <div className="participant-popup">
        <div className="participant-popup-inner">
          <h2>Event Participants</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="participants-container">
            <div className="participants-section">
              <h3>Organizers</h3>
              {eventOrganizers && eventOrganizers.length > 0 ? (
                <ul className="participants-list">
                  {eventOrganizers.map((organizer, index) => (
                    <li key={organizer.id || index} className="participant-item">
                      <div className="participant-info">
                        <div className="participant-name">{organizer.name || organizer.username || 'Unnamed Organizer'}</div>
                        <div className="participant-utorid">{organizer.utorid || 'No utorid provided'}</div>
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteOrganizer(organizer.id)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash}/>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-participants">No organizers assigned</p>
              )}
              
              {showAddOrganizer && (
                <div className="add-participant-form">
                  <form onSubmit={handleAddOrganizer}>
                    <div className="form-header">
                      <h4>Add Organizer</h4>
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
                      placeholder="Enter utorid"
                      value={newOrganizer.utorid}
                      onChange={(e) => setNewOrganizer({ utorid: e.target.value })}
                      required
                    />
                    <button 
                      type="submit" 
                      className="add-btn"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Organizer'}
                    </button>
                  </form>
                </div>
              )}
            </div>
            
            {!showAddOrganizer && (
              <button 
                className="add-participant-btn" 
                onClick={() => setShowAddOrganizer(true)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Organizer
              </button>
            )}
            
            <div className="participants-section">
              <h3>Guests</h3>
              {eventGuests && eventGuests.length > 0 ? (
                <ul className="participants-list">
                  {eventGuests.map((guest, index) => (
                    <li key={guest.id || index} className="participant-item">
                      <div className="participant-info">
                        <div className="participant-name">{guest.name || guest.username || 'Unnamed Guest'}</div>
                        <div className="participant-utorid">{guest.utorid || 'No utorid provided'}</div>
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteGuest(guest.id)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash}/>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-participants">No guests registered</p>
              )}
              
              {showAddGuest && (
                <div className="add-participant-form">
                  <form onSubmit={handleAddGuest}>
                    <div className="form-header">
                      <h4>Add Guest</h4>
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
                      placeholder="Enter utorid "
                      value={newGuest.utorid}
                      onChange={(e) => setNewGuest({ utorid: e.target.value })}
                      required
                    />
                    <button 
                      type="submit" 
                      className="add-btn"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Guest'}
                    </button>
                  </form>
                </div>
              )}
            </div>
            
            {!showAddGuest && (
              <button 
                className="add-participant-btn" 
                onClick={() => setShowAddGuest(true)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Guest
              </button>
            )}
          </div>
          
          <button 
            className="close-popup-btn" 
            onClick={() => setTrigger(false)}
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