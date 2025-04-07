const API_URL = 'http://localhost:5001';
const TOKEN = localStorage.getItem('token');

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

export const fetchPromotions = async (page = 1, limit = 5, filters = {}) => {
  let url = `${API_URL}/promotions?page=${page}&limit=${limit}`;
  
  if (filters.name) {
    url += `&name=${encodeURIComponent(filters.name)}`;
  }
  
  if (filters.type && filters.type !== 'both') {
    url += `&type=${encodeURIComponent(filters.type)}`;
  }
  
  if (filters.started) {
    url += '&started=true';
  }
  
  if (filters.ended) {
    url += '&ended=true';
  }
  
  const response = await fetch(url, { 
    method: 'GET',
    headers 
  });
  
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }
  
  return await response.json();
};

export const fetchPromotionDetails = async (id) => {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch promotion details: ${response.status}`);
  }
  
  return await response.json();
};

export const createPromotion = async (data) => {
  const response = await fetch(`${API_URL}/promotions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const updatePromotion = async (id, data) => {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
};

export const deletePromotion = async (id) => {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
};