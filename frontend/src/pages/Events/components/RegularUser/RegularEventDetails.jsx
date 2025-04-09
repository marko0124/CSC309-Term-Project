import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../../services/eventService';
import { useAuth } from '../../../../context/authContext';
import '../../../navbar.css';
import './RegularEventDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faCalendarAlt, 
    faMapMarkerAlt, 
    faUsers,
    faCheck,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import RegularParticipantPopup from './RegularParticipantPopup'; // Add this import

const RegularEventDetails = ({ eventId: eventIdProp }) => {
    const [event, setEvent] = useState(null);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId: eventIdParam } = useParams();
    const eventId = eventIdProp || eventIdParam;
    const {user} = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);

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

    const RSVPuser = async () => {
        setLoading(true);
        try {
            if (isRegistered) {
                console.log('Unregistering user from event');
                // Unregister the user
                await eventService.unrsvpUser(parseInt(eventIdProp || eventIdParam));
                
                // Update registration state immediately for better UX
                setIsRegistered(false);
                
                // Update the event state locally if needed for capacity display
                if (event.numGuests) {
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        numGuests: Math.max(0, (prevEvent.numGuests || 1) - 1)
                    }));
                }
            } else {
                console.log('Registering user for event');
                // Register the user
                await eventService.rsvpUser(parseInt(eventIdProp || eventIdParam));
                
                // Update registration state immediately for better UX
                setIsRegistered(true);
                
                // Update the event state locally if needed for capacity display
                if (event.numGuests !== undefined) {
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        numGuests: (prevEvent.numGuests || 0) + 1
                    }));
                }
            }
            
            // Refresh event details and user registration status after a short delay
            setTimeout(() => {
                fetchEventDetails();
                isUserRegistered(); // Re-check registration status from server
            }, 500);
            
        } catch (err) {
            console.error('RSVP error:', err);
            setError(err.message || 'Failed to update registration');
        } finally {
            setLoading(false);
        }
    };

    const isUserRegistered = async () => {
        try {
          const userInfo = await eventService.getUserInfo();
          console.log("User info attended:", userInfo.attended);
          
          if (userInfo && userInfo.attended && Array.isArray(userInfo.attended)) {
            // Check if the current event is in the attended array
            const isRegistered = userInfo.attended.some(event => 
              event.id === Number(eventId)
            );
            setIsRegistered(isRegistered);
            console.log("User is registered:", isRegistered);
          } else {
            setIsRegistered(false);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          setIsRegistered(false);
        }
    }
    useEffect(() => {
        fetchEventDetails();
        isUserRegistered();
    }, [fetchEventDetails]);


    const handleClosePopup = () => {
        setButtonPopup(false);
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
                <div className='navbar'> NAVBAR (Regular) </div>
                
                <div className='event-details-container'>
                    <Link to="/events" className="back-button">
                        <p><FontAwesomeIcon icon={faArrowLeft} />  Back to Events</p>
                    </Link>
                    
                    <div className="event-details"> 
                        <div className="title-div">
                            <h1>{event.name}</h1> 
                                <div className='publish-tag'>Published <FontAwesomeIcon icon={faCheck} /></div> : 
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
                                className="event-participants-button" 
                                onClick={() => setButtonPopup(true)}
                            >
                                <FontAwesomeIcon icon={faUsers} /> View Participants
                            </button>
                            <button 
                                className={`event-register-button ${isRegistered ? 'registered' : ''}`}
                                onClick={() => RSVPuser()}
                                disabled={loading}
                            >
                                {isRegistered ? 
                                    <span><FontAwesomeIcon icon={faCheck} /> Registered</span> : 
                                    <span><FontAwesomeIcon icon={faPlus} /> RSVP Me!</span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </main>
                {/* Add this at the end of your component */}
                {buttonPopup && (
                <RegularParticipantPopup
                    trigger={buttonPopup}
                    setTrigger={handleClosePopup}
                    eventGuests={event.guests || []}
                    eventOrganizers={event.organizers || []}
                    eventId={event.id}
                />
            )}
        </div>
    );
};

export default RegularEventDetails;