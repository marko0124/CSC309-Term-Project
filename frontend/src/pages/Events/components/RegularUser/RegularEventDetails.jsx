import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../../services/eventService';
import '../../../navbar.css';
import './RegularEventDetails.css'; // Create this file by copying and modifying OrganizerEventDetails.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faCalendarAlt, 
    faMapMarkerAlt, 
    faStar,
    faCheck 
} from '@fortawesome/free-solid-svg-icons';

const RegularEventDetails = ({ eventId: eventIdProp }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId: eventIdParam } = useParams();
    
    const eventId = eventIdProp || eventIdParam;

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
                <div className='navbar'> NAVBAR </div>
                
                <div className='event-details-container'>
                    <Link to="/events" className="back-button">
                        <p><FontAwesomeIcon icon={faArrowLeft} />  Back to Events</p>
                    </Link>
                    
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
                        
                        {/* Regular attendee options here - like register for event */}
                        <div className="event-buttons">
                            <button 
                                className="event-register-button" 
                                onClick={() => {/* Logic to register for event */}}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegularEventDetails;