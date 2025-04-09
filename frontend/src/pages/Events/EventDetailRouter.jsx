import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as eventService from './services/eventService';
import { useAuth } from '../../context/authContext';
import OrganizerEventDetails from './components/Organizer/OrganizerEventDetails';
import RegularEventDetails from './components/RegularUser/RegularEventDetails';
import ManagerEventDetails from './components/Manager/ManagerEventDetails';

const EventDetailRouter = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId } = useParams();
    const {user} = useAuth();
    const fetchEventDetails = useCallback(async () => {
        setLoading(true);
        try {
            const data = await eventService.fetchEventDetails(eventId);
            setEvent(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchEventDetails();
    }, [fetchEventDetails]);

    // Check if current user is an organizer
    const isCurrentUserOrganizer = () => {
        if (!event || !event.organizers || !user) return false;
        
        return event.organizers.some(organizer => 
            organizer.id === user.id || 
            organizer.utorid === user.utorid
        );
    };

    // Check if current user is a manager
    const isCurrentUserManager = () => {
        if (!event || !user ) return false;
        if (user.role === 'manager' || user.role === 'superuser') return true;
        else {
            return false
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader">Loading event details...</div>
            </div>
        );
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    if (!event) {
        return <div className="error-container">Event not found</div>;
    }

    // Route to the appropriate component based on user role
    if (isCurrentUserManager()) {
        return <ManagerEventDetails eventId={eventId} />;
    } else if (isCurrentUserOrganizer()) {
        return <OrganizerEventDetails eventId={eventId} />;
    } else {
        return <RegularEventDetails eventId={eventId} />;
    }
};

export default EventDetailRouter;