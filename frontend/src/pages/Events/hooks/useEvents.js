import { useState, useEffect, useCallback } from 'react';
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
  const [activeButtons, setActiveButtons] = useState({
    full: false,
    published: false,
    started: false,
    ended: false
  });
  const [filter, setFilter] = useState({
    name: '',
    location: '',
    page: 1,
    limit: itemsPerPage,
    full: false,
    published: true,
    started: false,
    ended: false,
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

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await eventService.fetchEvents(page, itemsPerPage, filter);
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

  const toggleFilterButton = (buttonKey) => {
    const newActiveButtons = {
      ...activeButtons,
      [buttonKey]: !activeButtons[buttonKey]
    };
    
    setActiveButtons(newActiveButtons);
    
    const newFilter = {
      ...filter,
      started: newActiveButtons.started,
      ended: newActiveButtons.ended
    };
    
    setFilter(newFilter);
  };

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setFilter({
      ...filter,
      name: searchTerm,
      location: locationTerm,
      page: 1
    });
    
    setCurrentPage(1);
  }, [filter, searchTerm, locationTerm]);

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
      startTime: new Date(formData.startTime + 'T00:00:00').toISOString(),
      endTime: new Date(formData.endTime + 'T00:00:00').toISOString(),
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
    resetForm
  };
};

export default useEvents;