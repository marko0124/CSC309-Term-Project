import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './navbar.css'; 
import './Promotions.css';
import supermarketImage from '../assets/supermarket.avif'; // Adjust the path as necessary
// Proper FontAwesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fullDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s";

  const truncatedDescription = fullDescription.substring(0, 100) + "...";

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
    <div className='wave-container'>
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      <div className='navbar'> NAVBAR </div>
      <div className='header-container'> 
        <div className='header-text'>
          <h1>A Title of the most Important Upcoming Event</h1>
          <div className='header-text-details'>
            <p className='promotion-tag'>some type</p>
            <p> Some Date</p>
          </div>
          <div className='expandable-text'>
            <p className='header-text-description'>
              {showFullDescription ? fullDescription : truncatedDescription}
            </p>
            <button 
              className='show-more-button'
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
        <div className='header-image'>
          <img className='himg' src={supermarketImage} alt="promotion" />
        </div>
      </div>
     
      <div class="custom-shape-divider-top-1743545933">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
      </div>
      <div className='promotions-list-container'>
        <div className='promotions-list'> 
          <p className='promotion-header'><h2>All Promotions (32)</h2></p>
          <div className='filter'>
            <input type='text' placeholder='Search for a promotion' className='search-bar'/>
            <button className='search-button'>Search <FontAwesomeIcon icon={faSearch}/></button>
          </div>
          <div>
            <button className='filter-button active-filter-button onetime'>One-Time</button>
            <button className='filter-button automatic'>Automatic</button>
          </div>
         
          <div className='promotions'>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
            <ul className='promotion'>
              <div className='promotion-details'> <div className='promotion-tag'>something</div> <p>some date</p></div>
              <div className='promotion-title'> Some title</div>
              <p className='promotion-description'>           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s
              </p>
            </ul>
            <div className='divider'></div>
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
           Footer

        </div>
      </div>
      
  );
};

export default Promotions;