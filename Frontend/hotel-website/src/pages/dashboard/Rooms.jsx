import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRooms } from '../../api/rooms';

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Available Rooms</h1>
      <Link to="/dashboard/add-room" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Room
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{room.name}</h2>
            <p>{room.description}</p>
            <p>Price: ${room.price}/night</p>
            <p>Capacity: {room.capacity} guests</p>
            <p>Status: {room.available ? 'Available' : 'Booked'}</p>
            <Link to={`/dashboard/edit-room/${room.id}`} className="text-blue-500">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;