import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as eventService from '../../services/eventService';
import OrganizerParticipantPopup from './OrganizerParticipantPopup';
import AwardPoints from '../controller/AwardPoints';
import './OrganizerEventDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrash, 
    faArrowLeft, 
    faUsers, 
    faPencilAlt, 
    faCalendarAlt, 
    faMapMarkerAlt, 
    faStar,
    faCheck 
} from '@fortawesome/free-solid-svg-icons';
import HomeNavbar from '../../../navbar/HomeNavbar';


const OrganizerEventDetails = ({ eventId: eventIdProp }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const { eventId: eventIdParam } = useParams();
    
    const eventId = eventIdProp || eventIdParam;
    
    const handleClosePopup = () => {
        setButtonPopup(false);
        // Force a refresh when closing the popup
        fetchEventDetails();
    };

    const fetchEventDetails = useCallback(async () => {
        setLoading(true);
        try {
            const data = await eventService.fetchEventDetails(eventIdParam || eventIdProp);
            setEvent(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventIdParam, eventIdProp]);

    useEffect(() => {
        fetchEventDetails();
    }, [fetchEventDetails]);

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setEditFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setEditFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        // Check for required fields
        if (!editFormData.name || !editFormData.description || 
            !editFormData.location || !editFormData.startTime || 
            !editFormData.endTime) {
            setUpdateError('Please fill in all required fields');
            return false;
        }
    
        // Check that start time is before end time
        const startDate = new Date(editFormData.startTime);
        const endDate = new Date(editFormData.endTime);
        
        if (startDate >= endDate) {
            setUpdateError('End time must be after start time');
            return false;
        }
        
        // Check that points is a positive number
        if (editFormData.points <= 0) {
            setUpdateError('Points must be greater than zero');
            return false;
        }
        
        return true;
    };
    
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setUpdateError(null);
        
        // Validate the form
        if (!validateForm()) {
            return;
        }
        
        setUpdateLoading(true);
        
        try {
            // Prepare the event data for the API
            const updatedEventData = {
                name: editFormData.name,
                description: editFormData.description,
                location: editFormData.location,
                startTime: new Date(editFormData.startTime).toISOString(),
                endTime: new Date(editFormData.endTime).toISOString(),
                capacity: editFormData.capacity !== '' ? editFormData.capacity : null,
                points: parseInt(editFormData.points),
                published: editFormData.published
            };
            
            // Call the API to update the event
            await eventService.updateEvent(eventId, updatedEventData);
            
            // Exit edit mode and refresh event data
            setIsEditing(false);
            fetchEventDetails();
            
        } catch (error) {
            console.error('Error updating event:', error);
            setUpdateError(error.message || 'Failed to update event. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader">Loading event details...</div>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <div className="error-message">Error: {error}</div>
        </div>
    );
    
    if (!event) return (
        <div className="error-container">
            <div className="error-message">Event not found</div>
        </div>
    );

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className='event-details-page'>
            <main>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
                <HomeNavbar> </HomeNavbar>
                
                <div className='event-details-container'>
                    <Link to="/events" className="back-button">
                        <p><FontAwesomeIcon icon={faArrowLeft} />  Back to Events</p>
                    </Link>
                    
                    {isEditing ? (
                        // Edit Form
                        <form onSubmit={handleSubmitEdit} className="edit-event-form">
                            <h2>Edit Event</h2>
                            
                            {updateError && <div className="error-message">{updateError}</div>}
                            
                            <div className="form-group">
                                <label htmlFor="name">Event Name</label>
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
                                <label htmlFor="description">Description</label>
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
                                <label htmlFor="location">Location</label>
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
                                    <label htmlFor="startTime">Start Time</label>
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
                                    <label htmlFor="endTime">End Time</label>
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
                                    <label htmlFor="capacity">Capacity</label>
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
                                    <label htmlFor="points">Change Points Allocated</label>
                                    <input
                                        type="number"
                                        id="points"
                                        name="points"
                                        value={editFormData.points}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder={`${event.pointsRemain || 0} Points Remain`}
                                    />
                                    <small className="helper-text">
                                        <div><strong>Total points allocated:</strong> {event.pointsRemain + (event.pointsAwarded || 0)} points</div>
                                        <div><strong>Currently remaining:</strong> {event.pointsRemain || 0} points</div>
                                        <div><strong>Already awarded:</strong> {(event.pointsAwarded || 0)} points</div>
                                    </small>
                                </div>
                            </div>
                            
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
                            <div className="event-details"> 
                                <div className="title-div">
                                    <h1>{event.name}</h1> 
                                    {event.published ? 
                                        <div className='publish-tag'>Published <FontAwesomeIcon icon={faCheck} /></div> : 
                                        <div className='draft-tag'>Draft</div>
                                    }
                                </div>
                                
                                <div className="event-info-grid">
                                    <div className="info-item">
                                        <h4>Location</h4>
                                        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                                    </div>
                                    
                                    <div className="info-item">
                                        <h4>Capacity</h4>
                                        <p>
                                            {(event.guests && event.capacity) ? 
                                                `${event.guests.length}/${event.capacity || 'Unlimited'}` : 
                                                `${event.numGuests || 0}/${event.capacity || 'Unlimited'}`
                                            }
                                        </p>
                                    </div>
                                    
                                    <div className="info-item">
                                        <h4>Points Available</h4>
                                        <p><FontAwesomeIcon icon={faStar} /> {event.pointsRemain}</p>
                                    </div>
                                </div>
                                
                                <span className='event-meta'>
                                    <FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(event.startTime)} - {formatDate(event.endTime)}
                                </span>
                            </div>
                            
                            <div className='event-content'>
                                <h3>Event Description</h3>
                                <p className="event-detail-description">{event.description}</p>
                                
                                <div className="event-buttons">
                                    <button 
                                        className="event-participants-button" 
                                        onClick={() => setButtonPopup(true)}
                                    >
                                        <FontAwesomeIcon icon={faUsers} /> View Participants
                                    </button>
                                    
                                    {/* Only show Edit button if current user is an organizer */}
                                    <button 
                                        className="event-edit-button"
                                        onClick={handleEditClick}
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} /> Edit Event
                                    </button>
                                </div>
                                
                                <div className="points-stats">
                                    <div className="stat-item">
                                        <h4>Total Point Allocated</h4>
                                        <p>{event.pointsRemain + event.pointsAwarded}</p>
                                    </div>
                                    <div className="stat-item">
                                        <h4>Points Remaining</h4>
                                        <p>{event.pointsRemain || 0}</p>
                                    </div>
                                    <div className="stat-item">
                                        <h4>Points Awarded</h4>
                                        <p>{event.pointsAwarded || 0}</p>
                                    </div>
                                </div>
                                
                                <AwardPoints 
                                    eventGuests={event.guests}
                                    eventId={event.id}
                                    pointsRemain={event.pointsRemain} 
                                    onPointsAwarded={fetchEventDetails} 
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>
            
            {/* Popups */}
            {buttonPopup && (
                <OrganizerParticipantPopup
                    trigger={buttonPopup}
                    setTrigger={handleClosePopup}
                    eventGuests={event.guests}
                    eventOrganizers={event.organizers}
                    eventId={event.id}
                    onUpdateParticipants={fetchEventDetails}
                />
            )}
        </div>
    );
};

export default OrganizerEventDetails;