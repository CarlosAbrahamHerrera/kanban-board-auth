import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import Auth from '../utils/auth';

const retrieveTickets = async () => {
  try {
    console.log('Retrieving tickets...');
    const response = await fetch(
      '/api/tickets/',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );
    
    // If response is empty, return empty array
    if (!response.ok) {
      console.error('Server error:', response.status);
      return [];
    }
    
    // Check if there's content before parsing JSON
    const text = await response.text();
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return [];
  }
};

const retrieveTicket = async (id: number | null): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );

    const data = await response.json();

    if(!response.ok) {
      throw new Error('Could not invalid API response, check network tab!');
    }
    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not fetch singular ticket');
  }
}

const createTicket = async (body: TicketData) => {
  try {
    // Clean up the data before sending
    const cleanedBody = {
      name: body.name || '',
      description: body.description || '',
      status: body.status || 'Todo',
      // Convert assignedUserId to a number to match the server's expectations
      assignedUserId: typeof body.assignedUserId === 'string' 
        ? parseInt(body.assignedUserId, 10) 
        : (body.assignedUserId || 1)
    };
    
    console.log('Creating ticket with exact cleaned data:', JSON.stringify(cleanedBody));
    
    const response = await fetch(
      '/api/tickets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(cleanedBody)
      }
    );
    
    // Log response status for debugging
    console.log('Response status:', response.status);
    
    // If status is not ok, return specific error
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    // Get response text first for logging
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    // Handle empty response
    if (!responseText) {
      return { success: true, id: 0 };
    }
    
    // Try to parse JSON from the response text
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      // Return a default object if JSON parsing fails
      return { success: true, message: 'Ticket created (no details returned)' };
    }
    
    console.log('Parsed response data:', data);
    return data;
  } catch (err) {
    console.error('Error from Ticket Creation: ', err);
    return Promise.reject(err instanceof Error ? err.message : 'Could not create ticket');
  }
}

const updateTicket = async (ticketId: number, body: TicketData): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(body)
      }
    )
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Update did not work', err);
    return Promise.reject('Update did not work');
  }
};

const deleteTicket = async (ticketId: number): Promise<ApiMessage> => {
  try {
    console.log(`Attempting to delete ticket with ID: ${ticketId}`);
    
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );
    
    console.log(`Delete response status: ${response.status}`);
    
    // Check if there's content before parsing JSON
    const responseText = await response.text();
    console.log(`Delete response text: ${responseText}`);
    
    let data;
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing delete response:', parseError);
        data = { message: 'Ticket deleted (no details returned)' };
      }
    } else {
      data = { message: 'Ticket deleted (empty response)' };
    }

    if(!response.ok) {
      throw new Error(data.message || `Failed to delete ticket: ${response.status}`);
    }

    console.log('Ticket successfully deleted');
    return data;
  } catch (err) {
    console.error('Error in deleting ticket', err);
    return Promise.reject(err instanceof Error ? err.message : 'Could not delete ticket');
  }
};


export { createTicket, deleteTicket, retrieveTickets, retrieveTicket, updateTicket};
