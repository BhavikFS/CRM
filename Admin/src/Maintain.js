import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';

function Maintain() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch the current maintenance mode status when the component mounts
  useEffect(() => {
    const fetchMaintenanceMode = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace 'token' with your actual token key
        const response = await fetch('http://localhost:8080/api/maintenance-mode', {
          headers: {
            'Authorization': `Bearer ${token}`, // Add the Bearer token
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          setIsMaintenanceMode(data.isMaintenanceMode);
          setMessage(data.message);
        } else {
          console.error('Failed to fetch maintenance mode status');
        }
      } catch (error) {
        console.error('Error fetching maintenance mode status:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMaintenanceMode();
  }, []);
  
  const handleToggle = async (event) => {
    const updatedStatus = event.target.checked;
    setIsMaintenanceMode(updatedStatus);
  
    try {
      const token = localStorage.getItem('token'); // Replace 'token' with your actual token key
      const response = await fetch('http://localhost:8080/api/maintenance-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the Bearer token
        },
        body: JSON.stringify({
          isMaintenanceMode: updatedStatus,
          message: message || 'The system is under maintenance.',
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Failed to update maintenance mode');
      } else {
        console.log('Maintenance mode updated successfully:', data);
      }
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SideBar>
        <div className="container-fluid text-center maintain">
          <h2>Maintenance Mode</h2>
          <hr />
          <input
            type="checkbox"
            id="switch"
            checked={isMaintenanceMode}
            onChange={handleToggle}
          />
          <label htmlFor="switch">Toggle</label>
        </div>
      </SideBar>
    </>
  );
}

export default Maintain;
