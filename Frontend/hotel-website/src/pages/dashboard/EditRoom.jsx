import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, updateRoom } from '../../api/rooms';

function EditRoom() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoom(id);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          capacity: data.capacity,
          available: data.available
        });
      } catch (error) {
        console.error('Failed to fetch room:', error);
      }
    };
    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRoom(id, {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      });
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('Failed to update room:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Room</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Room Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price per Night</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="mr-2"
            />
            Available
          </label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Update Room
        </button>
      </form>
    </div>
  );
}

export default EditRoom;