import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './navbar.css'; 
import './Promotions.css';
import supermarketImage from '../assets/supermarket.avif'; // Adjust the path as necessary

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [itemsPerPage] = useState(5);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeButtons, setActiveButtons] = useState({
    oneTime: false,
    automatic: false,
    started: false,
    ended: false
  });
  const [filter, setFilter] = useState({
    name: '',
    type: null,
    page: 1,
    limit: 10,
    started: false,
    ended: false,
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promotionType: 'one-time', 
    startDate: '',
    endDate: '',
    minSpending: null,
    rate: null,
    points: null
  });
  // Add this pagination component
 // Pagination component with improved stability
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return; // Prevent unnecessary re-renders
    
    setCurrentPage(newPage);
    fetchPromotions(newPage);
  };
  
  return (
    <div className="pagination">
      <button 
        type="button" // Important to prevent form submission behavior
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      <span className="page-info">
        Page {currentPage} of {totalPages || 1}
      </span>
      
      <button 
        type="button" // Important to prevent form submission behavior
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};
  
  const applySearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    
    // Update your filter
    setFilter({
      ...filter,
      name: searchTerm,
      page: page
    });
    
    setLoading(true);
    try {
      // Include page and limit in URL
      let url = `http://localhost:5001/promotions?name=${encodeURIComponent(searchTerm)}&page=${page}&limit=${itemsPerPage}`;
      // Add additional filter parameters if needed
      if (filter.type && filter.type !== 'both') {
        url += `&type=${encodeURIComponent(filter.type)}`;
      }
      if (filter.started) {
        url += '&started=true';
      }
      if (filter.ended) {
        url += '&ended=true';
      }
      
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc5NTkyNCwiZXhwIjoxNzQzODgyMzI0fQ.iRuTjmsQ9N1rAeid5sIm9q7Uc6sRKrKCOYWPW_w0Djc',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 400) {
        setPromotions([]);
        return;
      }
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      setPromotions(data);
      
      // Only reset to first page on initial search, not pagination clicks
      if (e) {
        setCurrentPage(1);
      } else {
        // If this was triggered by pagination, update the current page
        setCurrentPage(page);
      }
      
    } catch (error) {
      console.error('Error searching promotions:', error);
      alert('Failed to search promotions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this effect near your other useEffect hooks
  useEffect(() => {
    console.log("Filter updated:", filter);
  }, [filter]); // This runs whenever filter changes
  const toggleFilterButton = (buttonKey) => {
    const newActiveButtons = {
      ...activeButtons,
      [buttonKey]: !activeButtons[buttonKey]
    };
    
    setActiveButtons(newActiveButtons);
    
    // Update filter based on active buttons
    let filterType = null;
    
    // If only one type button is active, set filter to that type
    if (newActiveButtons.oneTime && !newActiveButtons.automatic) {
      filterType = 'one-time';
    } else if (!newActiveButtons.oneTime && newActiveButtons.automatic) {
      filterType = 'automatic';
    } else if (newActiveButtons.oneTime && newActiveButtons.automatic) {
      filterType = 'both'; // Now setting to "both" instead of null when both are active
    }
    // If neither are active, type remains null
    
    setFilter({
      ...filter,
      type: filterType,
      started: newActiveButtons.started,
      ended: newActiveButtons.ended
    });
  };
  const fullDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s";
  const truncatedDescription = fullDescription.substring(0, 100) + "...";

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPromotions = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:5001/promotions?page=${page}&limit=${itemsPerPage}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc5NTkyNCwiZXhwIjoxNzQzODgyMzI0fQ.iRuTjmsQ9N1rAeid5sIm9q7Uc6sRKrKCOYWPW_w0Djc',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Promotions:', data);
      
      setPromotions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
  
    fetchPromotions();
    
  }, []);

const fetchPromotionDetails = async (promotionId) => {
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:5001/promotions/${promotionId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc5NTkyNCwiZXhwIjoxNzQzODgyMzI0fQ.iRuTjmsQ9N1rAeid5sIm9q7Uc6sRKrKCOYWPW_w0Djc',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch promotion details: ${response.status}`);
    }
    
    const detailedPromotion = await response.json();
    console.log('Detailed promotion:', detailedPromotion);
    
    // Set the selected promotion with complete data
    setSelectedPromotion(detailedPromotion);
  } catch (error) {
    console.error('Error fetching promotion details:', error);
    alert('Failed to load promotion details: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// Update the handlePromotionClick function
const handlePromotionClick = (promotion, e) => {
  e.preventDefault(); // Prevent navigation
  
  // Set a temporary loading state
  setSelectedPromotion({...promotion, loading: true});
  
  // Fetch complete promotion details
  fetchPromotionDetails(promotion.id);
};
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation remains the same
      if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.promotionType) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Create the request payload
      const promotionData = {
        name: formData.title,
        description: formData.description,
        type: formData.promotionType,
        startTime: new Date(formData.startDate + 'T00:00:00').toISOString(),
        endTime: new Date(formData.endDate + 'T00:00:00').toISOString(),
        minSpending: formData.minSpending || null,
        rate: formData.rate || null,
        points: formData.points || null,
      };
      
      console.log("Submitting promotion data:", promotionData);
      try {
        let url = 'http://localhost:5001/promotions';
        let method = 'POST';
        
        // If in edit mode, update the URL and method for PUT request
        if (editMode) {
          url = `http://localhost:5001/promotions/${editingPromotionId}`;
          method = 'PATCH';
        }
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc5NTkyNCwiZXhwIjoxNzQzODgyMzI0fQ.iRuTjmsQ9N1rAeid5sIm9q7Uc6sRKrKCOYWPW_w0Djc',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(promotionData)
        });
    
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
    
        const result = await response.json();
        console.log(editMode ? 'Update success:' : 'Creation success:', result);
        
        // Reset states
        // Near the end of handleSubmit:
        // Reset states
        setButtonPopup(false);
        setEditMode(false);
        setFormData({
          title: '',
          description: '',
          promotionType: 'one-time',
          startDate: '',
          endDate: '',
          minSpending: '',
          rate: '',
          points: ''
        });
        setEditingPromotionId(null);

        // Refresh promotions list with current page
        fetchPromotions(currentPage); // Pass the current page
        // Refresh promotions list
        fetchPromotions();
        
      } catch (error) {
        console.error('Error submitting promotion:', error);
        alert(`Failed to ${editMode ? 'update' : 'create'} promotion: ${error.message}`);
      }
    };
    const handleDeleteClick = async () => {
      setEditingPromotionId(selectedPromotion.id);
      const confirmDelete = window.confirm('Are you sure you want to delete this promotion?');
      if (confirmDelete) {
        try {
          const response = await fetch(`http://localhost:5001/promotions/${selectedPromotion.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc5NTkyNCwiZXhwIjoxNzQzODgyMzI0fQ.iRuTjmsQ9N1rAeid5sIm9q7Uc6sRKrKCOYWPW_w0Djc',
              'Content-Type': 'application/json'
            }
          }); 
          
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
          
          // Close the details popup
          setSelectedPromotion(null);
          
          // Refresh the promotions list with current page
          fetchPromotions(currentPage); // Pass the current page
          
        } catch (error) {
          console.error('Error deleting promotion:', error);
          alert('Failed to delete promotion: ' + error.message);
        }
      }
    };

    const closeDetailPopup = () => {
      // Just close the popup without affecting other state
      setSelectedPromotion(null);
    };

    const handleEditClick = () => {
      // Save the ID of the promotion being edited
      setEditingPromotionId(selectedPromotion.id);
      
      // Set form data from the selected promotion
      setFormData({
        title: selectedPromotion.name,
        description: selectedPromotion.description,
        promotionType: selectedPromotion.type,
        startDate: new Date(selectedPromotion.startTime).toISOString().split('T')[0],
        endDate: new Date(selectedPromotion.endTime).toISOString().split('T')[0],
        minSpending: selectedPromotion.minSpending || '',
        rate: selectedPromotion.rate || '',
        points: selectedPromotion.points || ''
      });
      
      // Enable edit mode
      setEditMode(true);
      
      // Close the details popup
      setSelectedPromotion(null);
      
      // Open the form popup
      setButtonPopup(true);
    };
  
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className='background-container'>
      <div className='navbar'> NAVBAR </div>
      <div className='header-container'> 
        <div className='header-text'>
          <h1>A Title of the most Important Upcoming Event</h1>
          <div className='header-text-details'>
            <p className='promotion-tag'>some type</p>
            <p> Some Date</p>
          </div>
          <p className='header-text-description'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
          </p>
        </div>
        <div className='header-image'>
          <img className='himg' src={supermarketImage} alt="promotion" />
        </div>
      </div>

      <div className='promotions-list-container'>
        <div className='promotions-list'> 
          <p className='promotion-header'><h2>All Promotions (32)</h2></p>
          <div className='promotions'>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            {/* {promotions.length === 0 ? (
              <p>No promotions available</p>
            ) : (
              <ul>
                {promotions.map(promo => (
                  <li key={promo.id}>{promo.name} - {promo.description}</li>
                ))}
              </ul>
            )} */}
          </div>
          </div>
        </div>
        <div className='footer'> 
           

        </div>
      </div>
      
  );
};

export default Promotions;