import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../../services/eventService';
import '../Events.css';
import '../../../navbar.css';
import ParticipantPopup from './ParticipantPopup';
import AwardPoints from './AwardPoints';

const ManagerEventDetails = ({ eventId: eventIdProp }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Add edit mode state
    const [editFormData, setEditFormData] = useState({}); // State for form data
    const [updateLoading, setUpdateLoading] = useState(false); // Loading state for update
    const [updateError, setUpdateError] = useState(null); // Error state for update
    const { eventId: eventIdParam } = useParams();
    
    // Use either the prop or the URL parameter
    const eventId = eventIdProp || eventIdParam;
    
    // Add function to refresh event data
    const fetchEventDetails = useCallback(async () => {
        setLoading(true);
        try {
            const data = await eventService.fetchEventDetails(eventIdParam || eventIdProp);
            setEvent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventIdParam, eventIdProp]);

    useEffect(() => {
        fetchEventDetails();
    }, [fetchEventDetails]);

    // Initialize form data when entering edit mode
    const handleEditClick = () => {
        setEditFormData({
            name: event.name,
            description: event.description,
            location: event.location,
            startTime: new Date(event.startTime).toISOString().slice(0, 16),
            endTime: new Date(event.endTime).toISOString().slice(0, 16),
            capacity: event.capacity,
            points: event.points,
            published: event.published
        });
        setIsEditing(true);
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle different input types
        if (type === 'checkbox') {
            setEditFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setEditFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

// Add this function before the handleSubmitEdit function

const validateForm = () => {
    const errors = [];
    
    // Check that start time is before end time
    if (new Date(editFormData.startTime) >= new Date(editFormData.endTime)) {
      errors.push("Start time must be before end time");
    }
    
    // Check that dates are not in the past
    const now = new Date();
    if (new Date(editFormData.startTime) < now) {
      errors.push("Start time cannot be in the past");
    }
    
    if (new Date(editFormData.endTime) < now) {
      errors.push("End time cannot be in the past");
    }
    
    // Check capacity is positive if provided
    if (editFormData.capacity !== null && editFormData.capacity !== '' && editFormData.capacity < 0) {
      errors.push("Capacity must be a positive number or left empty for unlimited");
    }
    
    // Check points is positive
    if (editFormData.points <= 0) {
      errors.push("Points must be a positive number");
    }
    
    // Check if capacity reduction is valid
    if (event.numGuests !== undefined && 
        editFormData.capacity !== null && 
        editFormData.capacity < event.numGuests) {
      errors.push(`Cannot reduce capacity below current guest count (${event.numGuests})`);
    }
    
    // Check if points reduction is valid
    if (editFormData.points < event.points - (event.pointsRemain || 0)) {
      errors.push("Cannot reduce points below what has already been awarded");
    }
    
    return errors;
  };
  
  // Update the handleSubmitEdit function
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setUpdateError(validationErrors.join(". "));
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      // Format the data for the API
      const formattedData = {
        ...editFormData,
        // Ensure dates are in ISO format
        startTime: new Date(editFormData.startTime).toISOString(),
        endTime: new Date(editFormData.endTime).toISOString(),
        // Handle capacity as null for unlimited
        capacity: editFormData.capacity === '' ? null : editFormData.capacity
      };
      
      await eventService.updateEvent(event.id, formattedData);
      setIsEditing(false);
      // Refresh event data after update
      await fetchEventDetails();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };
    

    if (loading) return <div>Loading event details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!event) return <div>Event not found</div>;

    return (
        <div className='event-details-page'>
            <main>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
                <div className='navbar'> NAVBAR </div>
                
                <div className='event-details-container'>
                    <Link to="/events" className="back-button">← Back to Events</Link>
                    
                    {isEditing ? (
                        // Edit Form
                        <form onSubmit={handleSubmitEdit} className="edit-event-form">
                            <h2>Edit Event</h2>
                            
                            {updateError && <div className="error-message">{updateError}</div>}
                            
                            <div className="form-group">
                                <label htmlFor="name">Event Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleInputChange}
                                    rows="5"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={editFormData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="startTime">Start Time:</label>
                                    <input
                                        type="datetime-local"
                                        id="startTime"
                                        name="startTime"
                                        value={editFormData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="endTime">End Time:</label>
                                    <input
                                        type="datetime-local"
                                        id="endTime"
                                        name="endTime"
                                        value={editFormData.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="capacity">Capacity:</label>
                                    <input
                                        type="number"
                                        id="capacity"
                                        name="capacity"
                                        value={editFormData.capacity}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                    <small className="helper-text">
                                        Current attendees: {event.numGuests || 0}
                                    </small>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="points">Points:</label>
                                    <input
                                        type="number"
                                        id="points"
                                        name="points"
                                        value={editFormData.points}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder={`${event.pointsRemain || 0} points available`}
                                    />
                                    <small className="helper-text">
                                        <div><strong>Total points allocated:</strong> {event.pointsRemain + (event.pointsAwarded || 0)} points</div>
                                        <div><strong>Currently remaining:</strong> {event.pointsRemain || 0} points</div>
                                        <div><strong>Already awarded:</strong> {(event.pointsAwarded || 0)} points</div>
                                    </small>
                                </div>
                            </div>
                            
                            {!event.published && (
                                <div className="form-group checkbox-group">
                                    <label htmlFor="published">
                                        <input
                                            type="checkbox"
                                            id="published"
                                            name="published"
                                            checked={editFormData.published}
                                            onChange={handleInputChange}
                                        />
                                        Publish Event
                                    </label>
                                </div>
                            )}
                            
                            <div className="button-group">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="cancel-button"
                                    disabled={updateLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Regular view
                        <>
                            <div className='event-header'>
                                <h1>{event.name}</h1>
                                <div className='event-meta'>
                                    <span className='event-tag'>{event.published ? 'Published' : 'Draft'}</span>
                                    <span className='event-date'>
                                        {new Date(event.startTime).toLocaleDateString()} - 
                                        {new Date(event.endTime).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            
                            <div className='event-content'>
                                <p>{event.description}</p>
                                <p>Location: {event.location}</p>
                                <p>Capacity: {event.capacity || 'Unlimited'}</p>
                                <p>Points: {event.pointsRemain}</p>
                                <div className="event-buttons">
                                    <button 
                                        className="event-participants-button" 
                                        onClick={() => setButtonPopup(true)}
                                    >
                                        View Participants
                                    </button>
                                    <button 
                                        className="event-edit-button"
                                        onClick={handleEditClick}
                                    >
                                        Edit Event
                                    </button>
                                </div>
                            </div>
                            
                            <AwardPoints 
                                eventGuests={event.guests}
                                eventId={event.id}
                                pointsRemain={event.pointsRemain} 
                            />
                        </>
                    )}
                </div>
            </main>
            
            {/* Popups */}
            {buttonPopup && (
                <ParticipantPopup
                    trigger={buttonPopup}
                    setTrigger={setButtonPopup}
                    eventGuests={event.guests}
                    eventOrganizers={event.organizers}
                    eventId={event.id}
                    onUpdateParticipants={fetchEventDetails}
                />
            )}
        </div>
    );
};

export default ManagerEventDetails;