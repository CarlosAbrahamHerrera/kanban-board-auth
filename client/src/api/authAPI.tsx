import { UserLogin } from "../interfaces/UserLogin";

// Using absolute URL to ensure correct server connection
const API_URL = 'http://localhost:3001';

export const login = async (userInfo: UserLogin) => {
  // Debug log of what's being sent
  console.log('Sending login request to:', `${API_URL}/login`);
  console.log('With data:', userInfo);
  
  try {
    // Hardcoded exact URL to prevent any path issues
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    
    // Attempt to read response for debugging
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    // Parse the response if it's JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid response format');
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Login failed');
    }

    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};
