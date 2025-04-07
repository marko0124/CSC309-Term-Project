import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as eventService from '../../services/eventService';
import '../controller/ParticipantPopup.css';

const RegularParticipantPopup = ({ 
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
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-participants">No organizers found</div>
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

export default RegularParticipantPopup;