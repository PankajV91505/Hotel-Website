import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRooms, deleteRoom } from '../../api/auth';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view rooms');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        const roomsData = await getRooms();
        setRooms(roomsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setError(error.response?.data?.message || 'Failed to load rooms');
        setLoading(false);
      }
    };
    fetchRooms();
  }, [navigate]);

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error('Failed to delete room:', error);
      setError(error.response?.data?.message || 'Failed to delete room');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Rooms</h1>
        <Link to="/dashboard/add-room" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Add New Room
        </Link>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {rooms.length === 0 ? (
        <p className="text-center text-gray-600">No rooms available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-gray-600">Description: {room.description || 'N/A'}</p>
              <p className="text-gray-600">Price: ${room.price}/night</p>
              <p className="text-gray-600">Capacity: {room.capacity} guests</p>
              <p className="text-gray-600">
                Status: {room.available ? 'Available' : 'Booked'}
              </p>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/dashboard/edit-room/${room.id}`}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;