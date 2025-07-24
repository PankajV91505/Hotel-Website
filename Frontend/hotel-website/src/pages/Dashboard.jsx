import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms, deleteRoom, getUserDetails } from "../api/auth"; // Adjusted path to auth.js
import { toast } from 'react-toastify';

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomsAndUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view rooms.");
          navigate("/login");
          return;
        }

        const [roomsResponse, userResponse] = await Promise.all([
          getRooms(),
          getUserDetails()
        ]);
        setRooms(roomsResponse);
        setIsAdmin(userResponse.is_admin);
      } catch (err) {
        console.error("Error fetching rooms or user details:", err);
        setError("Failed to fetch rooms: " + (err.response?.data?.message || err.message));
        toast.error("Failed to fetch rooms: " + (err.response?.data?.message || err.message));
        // If authentication fails, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchRoomsAndUserDetails();
  }, [navigate]);

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);
        setRooms(rooms.filter(r => r.id !== roomId));
        toast.success("Room deleted successfully!");
      } catch (err) {
        console.error("Error deleting room:", err);
        setError("Failed to delete room: " + (err.response?.data?.message || err.message));
        toast.error("Failed to delete room: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Available Rooms</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {isAdmin && (
          <div className="mb-6 text-center">
            <Link
              to="/dashboard/add-room"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg text-lg font-semibold"
            >
              Add New Room
            </Link>
          </div>
        )}

        {rooms.length === 0 && !error ? (
          <p className="text-center text-gray-600 text-lg">No rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01]">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{room.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold text-green-600">Price: ₹{room.price}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.availability ? "Available" : "Booked"}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><strong>Type:</strong> {room.room_type}</p>
                  <p><strong>AC:</strong> {room.is_ac ? "Yes" : "No"}</p>
                  <p><strong>Parking:</strong> {room.has_parking ? "Yes" : "No"}</p>
                </div>
                {room.availability ? (
                  <Link
                    to={`/dashboard/book-room/${room.id}`}
                    className="w-full text-center inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
                  >
                    Book Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center inline-block px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
                {isAdmin && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <Link
                      to={`/dashboard/edit-room/${room.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
