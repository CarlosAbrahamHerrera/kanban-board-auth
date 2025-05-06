import Auth from '../utils/auth';

const retrieveUsers = async () => {
  try {
    console.log('Retrieving users...');
    const response = await fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    
    // If response is not ok, return empty array
    if (!response.ok) {
      console.error('Server error:', response.status);
      return [{ id: 1, username: 'Default User' }];
    }
    
    // Check if there's content before parsing JSON
    const text = await response.text();
    if (!text) {
      console.log('Empty response from users API, using default user');
      return [{ id: 1, username: 'Default User' }];
    }
    
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error('Error parsing user response:', parseError);
      return [{ id: 1, username: 'Default User' }];
    }
  } catch (err) { 
    console.log('Error from data retrieval:', err);
    return [{ id: 1, username: 'Default User' }];
  }
}

export { retrieveUsers };
