import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/auth';

function AddRoom() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to add a room');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      await createRoom({
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        available,
      });
      setMessage('Room added successfully! Redirecting to rooms...');
      setTimeout(() => navigate('/dashboard/rooms'), 2000);
    } catch (error) {
      console.error('Failed to add room:', error);
      setError(error.response?.data?.message || 'Failed to add room. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Room</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <div className="bg-white p-6 rounded shadow-md">
          <form onSubmit={handleAddRoom}>
            <div className="mb-4">
              <label className="block text-gray-700">Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price ($/night)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Capacity (guests)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full p-2 border rounded"
                required
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Availability</label>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="mr-2"
              />
              <span>Is Available</span>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Add Room
            </button>
          </form>
          <p className="mt-4 text-center">
            <a href="/dashboard/rooms" className="text-blue-500 hover:underline">
              Back to Rooms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddRoom;