import React, { useState, useEffect } from 'react';
import './AwardPoints.css';
import * as eventService from '../../services/eventService';
import { BiCurrentLocation } from 'react-icons/bi';

// Add pointsRemain to the props
const AwardPoints = ({ eventGuests, eventId}) => {
  const [selectedGuest, setSelectedGuest] = useState('all');
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pointsRemain, setPointsRemain] = useState(0); // New state for points remaining

  // Reset selected guest when event guests change
  useEffect(() => {
    setSelectedGuest('all');
  }, [eventGuests]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (points <= 0) {
      setError('Points must be greater than zero');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
        await eventService.awardPoints(eventId, selectedGuest, points);
        const event = await eventService.fetchEventDetails(eventId);
        setPointsRemain(event.pointsRemain); // Update points remaining after awarding points
        
      
        // Handle success
        setSuccess(true);
        setPoints(0); // Reset points input
      
        // Clear success message after a delay
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to award points');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="award-points-container">
      <h3>Award Points to Attendees</h3>
      
      <form onSubmit={handleSubmit} className="award-points-form">
        <div className="form-group">
            <label htmlFor="guest-select">Recipient:</label>
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
                    <option key={guest.id} value={guest.id}>
                    {guest.name || guest.username || `Guest #${guest.id}`}
                    </option>
                ))}
            </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="points-input">Points: {pointsRemain} points Available</label>
          <input 
            id="points-input"
            type="number" 
            min="1"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            placeholder={`${pointsRemain || 0} points available`}
            required
            className="input-field"
          />
        </div>
        
        <button 
          type="submit" 
          className="award-btn"
          disabled={isLoading || points <= 0 || points > (pointsRemain || 0)}
        >
          {isLoading ? 'Awarding...' : 'Award Points'}
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Points awarded successfully!</p>}
    </div>
  );
};

export default AwardPoints;