import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch rooms
        const roomsResponse = await axios.get("http://localhost:5000/api/rooms/rooms");
        setRooms(roomsResponse.data);
        // Fetch user bookings
        const bookingsResponse = await axios.get("http://localhost:5000/api/rooms/my-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsResponse.data);
        // Check admin status
        const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAdmin(userResponse.data.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {isAdmin && (
          <div className="mb-6 text-center">
            <Link
              to="/dashboard/add-room"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add New Room
            </Link>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p>{room.description}</p>
                <p className="font-bold">Price: ${room.price}</p>
                <p>Status: {room.availability ? "Available" : "Booked"}</p>
                {room.availability && (
                  <Link
                    to="/dashboard/book-room"
                    className="mt-2 inline-block bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-center">No bookings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-xl font-semibold">{booking.room_name}</h3>
                  <p>Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
                  <p>End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
                  <p>Booked On: {new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;