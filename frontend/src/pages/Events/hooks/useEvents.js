import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as eventService from '../services/eventService';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeButtons, setActiveButtons] = useState({
    showFull: false,
    published: true,
    started: false,
    ended: false
  });
  const [filter, setFilter] = useState({
    name: '',
    location: '',
    page: 1,
    limit: itemsPerPage,
    showFull: false,
    published: true,
    started: null,
    ended: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    capacity: '',
    points: ''
  });

  useEffect(() => {
    // Read parameters from URL on initial load
    const urlSearchTerm = searchParams.get('search') || '';
    const urlLocationTerm = searchParams.get('location') || '';
    const urlType = searchParams.get('type');
    const urlStarted = searchParams.has('started');
    const urlEnded = searchParams.has('ended');
    
    // Set initial states from URL
    setSearchTerm(urlSearchTerm);
    if (setLocationTerm) setLocationTerm(urlLocationTerm);
    
    // Set filter buttons active state based on URL
    setActiveButtons({
      ...activeButtons,
      oneTime: urlType === 'one-time' || urlType === 'both',
      automatic: urlType === 'automatic' || urlType === 'both',
      started: urlStarted,
      ended: urlEnded
    });
    
    // Set filter state based on URL
    setFilter({
      ...filter,
      name: urlSearchTerm,
      location: urlLocationTerm,
      type: urlType,
      started: urlStarted,
      ended: urlEnded,
      page: parseInt(searchParams.get('page') || '1')
    });
    
    setCurrentPage(parseInt(searchParams.get('page') || '1'));
  }, []); 

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await eventService.fetchEvents(page, itemsPerPage, filter);
      console.log('Fetched events:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, itemsPerPage]);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [fetchEvents, currentPage]);

  // This function now only updates the activeButtons state without changing filters
  const toggleFilterButton = (buttonKey) => {
    setActiveButtons(prev => ({
      ...prev,
      [buttonKey]: !prev[buttonKey]
    }));
    
  };

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Apply all active button states when searching
    setFilter({
      ...filter,
      name: searchTerm,
      location: locationTerm,
      page: 1,
      // Include filter button states
      showFull: activeButtons.showFull,
      published: activeButtons.published,
      started: activeButtons.started,
      ended: activeButtons.ended
    });
    
    // Update URL parameters
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (locationTerm) newParams.set('location', locationTerm);
    if (activeButtons.showFull) newParams.set('showFull', 'true');
    if (activeButtons.published) newParams.set('published', 'true');
    if (activeButtons.started) newParams.set('started', 'true');
    if (activeButtons.ended) newParams.set('ended', 'true');
    newParams.set('page', '1');
    setSearchParams(newParams);
    
    setCurrentPage(1);
  }, [filter, searchTerm, locationTerm, activeButtons, setSearchParams]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEventClick = async (event, e) => {
    if (e) e.preventDefault();
    setSelectedEvent({...event, loading: true});
    
    // Redirect to event detail page
    window.location.href = `/events/${event.id}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateClick = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset form data to empty values for a new event
    setFormData({
      name: '',
      description: '',
      location: '',
      startTime: today + 'T10:00', // Default to 10:00 today
      endTime: today + 'T12:00',   // Default to 12:00 today
      capacity: '',
      points: ''
    });
    
    // Clear any selected event (in case there was one)
    setSelectedEvent(null);
    
    // Show the popup
    setButtonPopup(true);
    
    console.log('Create event button clicked, buttonPopup set to:', true); // Debug
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.location || 
        !formData.startTime || !formData.endTime || !formData.points) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const eventData = {
      name: formData.name,
      location: formData.location,
      description: formData.description,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      capacity: formData.capacity || null,
      points: formData.points || null,
    };
    
    try {
      await eventService.createEvent(eventData);
      resetForm();
      fetchEvents(currentPage);
    } catch (error) {
      console.error('Error submitting event:', error);
      alert(`Failed to create event: ${error.message}`);
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    
    setFormData({
      name: event.name,
      description: event.description,
      location: event.location,
      startTime: new Date(event.startTime).toISOString().split('T')[0],
      endTime: new Date(event.endTime).toISOString().split('T')[0],
      capacity: event.capacity || '',
      points: event.points || ''
    });
    
    setButtonPopup(true);
  };

  const handleDeleteClick = async () => {
    if (!selectedEvent) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await eventService.deleteEvent(selectedEvent.id);
        setSelectedEvent(null);
        fetchEvents(currentPage);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setButtonPopup(false);
    setFormData({
      name: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      capacity: '',
      points: ''
    });
  };

  return {
    events,
    loading,
    currentPage,
    itemsPerPage,
    buttonPopup,
    selectedEvent,
    searchTerm,
    activeButtons,
    filter,
    formData,
    setButtonPopup,
    locationTerm,
    setSearchTerm,
    setLocationTerm,
    setSelectedEvent,
    handleSearch,
    handlePageChange,
    handleEventClick,
    handleInputChange,
    handleSubmit,
    handleEditClick, 
    handleDeleteClick,
    toggleFilterButton,
    handleCreateClick,
    resetForm
  };
};

export default useEvents;