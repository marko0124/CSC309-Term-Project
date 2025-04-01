import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

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
    <div>
      <h1>Promotions</h1>
      {promotions.length === 0 ? (
        <p>No promotions available</p>
      ) : (
        <ul>
          {promotions.map(promo => (
            <li key={promo.id}>{promo.name} - {promo.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Promotions;