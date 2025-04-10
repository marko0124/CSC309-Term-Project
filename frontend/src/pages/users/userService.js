import env from "react-dotenv";

const API_URL = process.env.REACT_APP_BACKEND_URL;
export const fetchUsers = async (page = 1, limit = 5, filters = {}, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  let url = `${API_URL}/users?page=${page}&limit=${limit}`;
  var roles = "";
  if (filters.role) {
    for (var i = 0; i < filters.role.length; i++) {
      if (i === 0) {
        roles += filters.role[i];
      } else {
        roles += " " + filters.role[i];
      }
    }
  }
  
  if (filters.name) {
    url += `&name=${encodeURIComponent(filters.name)}`;
  }
  
  if (roles !== "") {
    url += `&role=${encodeURIComponent(roles)}`;
  }
  
  if (filters.verified) {
    url += '&verified=true';
  }
  
  if (filters.activated) {
    url += '&activated=true';
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

export const fetchUserDetails = async (id, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user details: ${response.status}`);
  }
  
  return await response.json();
};

export const createUser = async (data, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const updateUser = async (id, data, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
  
  return await response.json();
};