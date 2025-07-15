import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/get-token', {
          withCredentials: true
        });
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        navigate('/dashboard/rooms');
      } catch (error) {
        console.error('Failed to fetch token:', error);
        navigate('/login');
      }
    };
    fetchToken();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;