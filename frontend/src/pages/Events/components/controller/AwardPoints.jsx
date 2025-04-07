import React, { useState, useEffect } from 'react';
import './AwardPoints.css';
import * as eventService from '../../services/eventService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faCheck } from '@fortawesome/free-solid-svg-icons';

const AwardPoints = ({ eventGuests, eventId, pointsRemain, onPointsAwarded }) => {
  const [selectedGuest, setSelectedGuest] = useState('all');
  const [points, setPoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset selected guest when event guests change
  useEffect(() => {
    setSelectedGuest('all');
  }, [eventGuests]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const pointsNum = parseInt(points) || 0;
    
    if (pointsNum <= 0) {
      setError('Points must be greater than zero');
      return;
    }
    
    if (pointsNum > pointsRemain) {
      setError('Not enough points available');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log("Selected guest:", selectedGuest); // Debug: log selected guest
      
      // Handle "all" guests differently than individual guests
      if (selectedGuest === 'all') {
        // Check if there are any guests to award points to
        if (!eventGuests || eventGuests.length === 0) {
          throw new Error('No guests available to award points');
        }
        
        // Directly use 'all' as a special value
        console.log("Calling API with 'all' guests and points:", pointsNum);
        await eventService.awardPoints(eventId, 'all', pointsNum);
      } else {
        // For individual guest
        // The selectedGuest should already be the ID from the select option
        console.log("Calling API with individual guest ID:", selectedGuest, "and points:", pointsNum);
        
        await eventService.awardPoints(eventId, selectedGuest, pointsNum);
      }
      
      // Handle success
      setSuccess(true);
      setPoints(''); // Reset points input to empty string
      
      // Notify parent component to refresh event data
      if (onPointsAwarded && typeof onPointsAwarded === 'function') {
        onPointsAwarded();
      }
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error awarding points:', err);
      setError(err.message || 'Failed to award points');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="award-points-container">
      <h3>
        Award Points to Attendees
      </h3>
      
      <form onSubmit={handleSubmit} className="award-points-form">
        <div className="form-group">
          <label htmlFor="guest-select">
            Recipient:
          </label>
          <select 
            id="guest-select"
            value={selectedGuest}
            onChange={(e) => setSelectedGuest(e.target.value)}
            className="select-field"
            disabled={!eventGuests || eventGuests.length === 0}
          >
            <option value="all">
              {!eventGuests || eventGuests.length === 0 ? 'No guests available' : 'All guests'}
            </option>
            
            {eventGuests && eventGuests.map(guest => (
              <option key={guest.id} value={guest.utorid || guest.id}>
                {guest.name || guest.username || `Guest #${guest.id}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="points-input">
            Points to Award:
          </label>
          <div className="points-input-container">
            <input 
              id="points-input"
              type="number" 
              min="1"
              max={pointsRemain}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Enter points"
              required
              className="input-field"
            />
            <span className="points-available">{pointsRemain} points available</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="award-btn"
          disabled={
            isLoading || 
            !points || 
            parseInt(points) <= 0 || 
            parseInt(points) > pointsRemain || 
            !eventGuests || 
            eventGuests.length === 0
          }
        >
          {isLoading ? 'Awarding...' : 'Award Points '}
          {!isLoading && <FontAwesomeIcon icon={faCheck} className="button-icon" />}
        </button>
      </form>
      
      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">
        <FontAwesomeIcon icon={faCheck} /> Points awarded successfully!
      </div>}
    </div>
  );
};

export default AwardPoints;