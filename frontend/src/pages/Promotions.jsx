import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './navbar.css'; 
import './Promotions.css';
import supermarketImage from '../assets/supermarket.avif'; // Adjust the path as necessary

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await apiClient.get('http://localhost:5001/promotions');
        setPromotions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

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