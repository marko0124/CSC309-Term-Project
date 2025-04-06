import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../../services/eventService';
import '../Events.css';
import '../../../navbar.css';

const ManagerEventDetails = ({ eventId: eventIdProp }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId: eventIdParam } = useParams();
    
    // Use either the prop or the URL parameter
    const eventId = eventIdProp || eventIdParam;
    
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const data = await eventService.fetchEventDetails(eventId);
                setEvent(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

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
                        <p>Points: {event.points}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerEventDetails;