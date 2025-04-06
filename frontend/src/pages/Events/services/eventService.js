const API_URL = 'http://localhost:5001';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzk3MTU1OCwiZXhwIjoxNzQ0MDU3OTU4fQ.mwmwYvmz8A-XgaaGA4rYOrNJK_N2vL0UnqHnUhwOStY';

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
  
  // Change this from filters.full to filters.showFull
  if (filters.showFull) {
    url += '&showFull=true';
  } else {
    url += '&showFull=false';
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

// Add or update this function in your eventService.js
export const updateEvent = async (eventId, eventData) => {
  // Create a new object with only the fields that have changed
  const payload = {};
  
  // Add fields to the payload only if they are provided in eventData
  if (eventData.name !== undefined) payload.name = eventData.name;
  if (eventData.description !== undefined) payload.description = eventData.description;
  if (eventData.location !== undefined) payload.location = eventData.location;
  if (eventData.startTime !== undefined) payload.startTime = eventData.startTime;
  if (eventData.endTime !== undefined) payload.endTime = eventData.endTime;
  if (eventData.capacity !== undefined) payload.capacity = eventData.capacity;
  if (eventData.points !== undefined) payload.points = eventData.points;
  if (eventData.published !== undefined) payload.published = eventData.published;

  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    // Try to get detailed error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server responded with ${response.status}`);
    } catch (e) {
      throw new Error(`Server responded with ${response.status}`);
    }
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
export const deleteOrganizer = async (eventId, organizerId) => {
  const response = await fetch(`${API_URL}/events/${eventId}/organizers/${organizerId}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  // Don't try to parse JSON for 204 No Content responses
  if (response.status === 204) {
    return { success: true };
  }
  
  // Only try to parse JSON if there's content
  return await response.json();
};

export const deleteGuest = async (eventId, guestId) => {
  const response = await fetch(`${API_URL}/events/${eventId}/guests/${guestId}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  // Don't try to parse JSON for 204 No Content responses
  if (response.status === 204) {
    return { success: true };
  }
  
  // Only try to parse JSON if there's content
  return await response.json();
};

export const addOrganizer = async (eventId, utorid) => {
  const response = await fetch(`${API_URL}/events/${eventId}/organizers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ utorid })
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const addGuest = async (eventId, utorid) => {
  const response = await fetch(`${API_URL}/events/${eventId}/guests`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ utorid })
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const awardPoints = async (eventId, guestId, points) => {
  const response = await fetch(`${API_URL}/events/${eventId}/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ 
      type: 'event',
      utorid: guestId === 'all' ? null : guestId, // FIXED: Send null when 'all' is selected
      amount: parseInt(points)
    })
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
}