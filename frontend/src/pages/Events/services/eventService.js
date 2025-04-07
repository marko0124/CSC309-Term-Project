const API_URL = 'http://localhost:5001';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZSI6InJlZ3VsYXIiLCJpYXQiOjE3NDQwNTA3NDUsImV4cCI6MTc0NDEzNzE0NX0.rXMXGqK8YE5mxqQnUsu01X0xDuH6-inFb4pymxlUx3c';

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
  const response = await fetch(`${API_URL}/events/${id}?include=guests,organizers`, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch event details: ${response.status}`);
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

export const rsvpUser = async (eventId) => {
  console.log("RSVPing for user with ID:", headers.Authorization);
  const response = await fetch(`${API_URL}/events/${eventId}/guests/me`, {
    method: 'POST',
    headers
  });
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  return await response.json();
}

export const cancelRsvp = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/guests/me`, {
      method: 'DELETE',
      headers
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
  } catch (error) {
    console.error('Error canceling RSVP:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  console.log("Deleting event with ID:", eventId);
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
};

// Rename this function from deleteOrganizer to removeOrganizer for consistency
export const deleteOrganizer = async (eventId, utorid) => {
  try {
    console.log("Removing organizer with ID:", utorid);
    console.log("Event ID:", eventId);
    const response = await fetch(`${API_URL}/events/${eventId}/organizers/${utorid}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      // Try to get more detailed error information
      const errorText = await response.text();
      console.error("Server error response when removing organizer:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to remove organizer (${response.status}): ${errorText}`);
      }
    }
    
    console.log("Organizer removed successfully:", utorid);
    // Handle 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing organizer:', error);
    throw error;
  }
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
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/guests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ utorid })
    });
    
    if (!response.ok) {
      // Try to get more detailed error information
      const errorText = await response.text();
      console.error("Server error response when adding guest:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to add guest (${response.status}): ${errorText}`);
      }
    }
    
    console.log("Guest added successfully:", utorid);
    return await response.json();
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const awardPoints = async (eventId, guestId, points) => {
  try {
    // Convert points to a number to ensure correct type
    const pointsNum = parseInt(points);
    
    // Create the payload according to the API documentation
    let payload = {
      type: "event",     // Required field per API docs: must be "event"
      amount: pointsNum  // API expects "amount", not "points"
    };
    
    // For individual guest, add the utorid
    // When utorid is not provided, points are awarded to all guests
    if (guestId !== 'all') {
      // Find the guest's utorid from the eventGuests array
      // Note: This assumes you have the guest's utorid available
      // If you only have their ID, you might need to fetch their details first
      payload.utorid = guestId;
    }
    
    console.log("Correct API Payload:", payload);
    
    const response = await fetch(`${API_URL}/events/${eventId}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    // For debugging, try to log the exact response
    if (!response.ok) {
      // Try to get more detailed error information
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      } catch (e) {
        // If we can't parse the error as JSON, use the raw text
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};
