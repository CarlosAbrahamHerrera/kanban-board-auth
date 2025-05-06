import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { retrieveUsers } from '../api/userAPI';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData | undefined>(
    {
      id: 0,
      name: '',
      description: '',
      status: 'Todo',
      assignedUserId: 1,  // Default to user ID 1
      assignedUser: null
    }
  );

  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[] | undefined>([]);
  const [usersLoaded, setUsersLoaded] = useState<boolean>(false);

  const getAllUsers = async () => {
    try {
      const data = await retrieveUsers();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        // If no users are retrieved, create a default user
        setUsers([{ id: 1, username: 'Default User' }]);
      }
      setUsersLoaded(true);
    } catch (err) {
      console.error('Failed to retrieve user info', err);
      // Set a default user if retrieval fails
      setUsers([{ id: 1, username: 'Default User' }]);
      setUsersLoaded(true);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newTicket) {
      console.error('No ticket data to submit');
      return;
    }
    
    // Validate required fields
    if (!newTicket.name || !newTicket.description) {
      console.error('Name and description are required');
      alert('Please fill in both name and description fields');
      return;
    }
    
    // Ensure assignedUserId is a number
    const ticketToSubmit = {
      ...newTicket,
      assignedUserId: typeof newTicket.assignedUserId === 'string' 
        ? parseInt(newTicket.assignedUserId, 10) 
        : newTicket.assignedUserId
    };
    
    // Log the exact data being sent
    console.log('Submitting ticket with exact data:', JSON.stringify(ticketToSubmit));
    
    try {
      const data = await createTicket(ticketToSubmit);
      console.log('Ticket created successfully:', data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  }

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convert assignedUserId to a number since it comes as string from the form
    const parsedValue = name === 'assignedUserId' ? parseInt(value, 10) : value;
    setNewTicket((prev) => (prev ? { ...prev, [name]: parsedValue } : undefined));
  }

  return (
    <>
      <div className='container'>
        <form className='form' onSubmit={handleSubmit}>
          <h1>Create Ticket</h1>
          <label htmlFor='tName'>Ticket Name</label>
          <textarea 
            id='tName'
            name='name'
            value={newTicket?.name || ''}
            onChange={handleTextAreaChange}
            />
          <label htmlFor='tStatus'>Ticket Status</label>
          <select 
            name='status' 
            id='tStatus'
            value={newTicket?.status || ''}
            onChange={handleTextChange}
          >
            <option value='Todo'>Todo</option>
            <option value='In Progress'>In Progress</option>
            <option value='Done'>Done</option>
          </select>
          <label htmlFor='tDescription'>Ticket Description</label>
          <textarea 
            id='tDescription'
            name='description'
            value={newTicket?.description || ''}
            onChange={handleTextAreaChange}
          />
          <label htmlFor='tUserId'>User's ID</label>
          {usersLoaded && users && users.length > 0 ? (
            <select
              name='assignedUserId'
              id='tUserId'
              value={String(newTicket?.assignedUserId || 1)}
              onChange={handleUserChange}
            >
              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.username}
                </option>
              ))}
            </select>
          ) : (
            <input
              type='number'
              id='tUserId'
              name='assignedUserId'
              value={newTicket?.assignedUserId || 1}
              onChange={handleTextChange}
              min='1'
            />
          )}
          <button type='submit'>Submit Form</button>
        </form>
      </div>
    </>
  )
};

export default CreateTicket;
