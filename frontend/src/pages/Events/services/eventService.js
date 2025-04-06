const API_URL = 'http://localhost:5001';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0MzkxNTU0OSwiZXhwIjoxNzQ0MDAxOTQ5fQ.Bze2F8heUVRUu-sDBcrSb0lUMAPMbfb-_1TuT1qQZws';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

export const fetchEvents = async (page = 1, limit = 5, filters = {}) => {
  let url = `${API_URL}/events?page=${page}&limit=${limit}`;
  
  if (filters.name) {
    url += `&name=${encodeURIComponent(filters.name)}`;
  }
  if (filters.location) {
    url += `&location=${encodeURIComponent(filters.location)}`;
  }
  
  if (filters.full) {
    url += '&full=true';
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

export const fetchEventDetails = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch promotion details: ${response.status}`);
  }
  
  return await response.json();
};

export const createEvent = async (data) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const updateEvent = async (id, data) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};