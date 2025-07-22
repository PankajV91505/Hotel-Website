import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms, getMyBookings, deleteRoom, getUserDetails } from "../api/auth";
import { toast } from 'react-toastify';

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in");
          navigate("/login");
          return;
        }
        const [roomsResponse, bookingsResponse, userResponse] = await Promise.all([
          getRooms(),
          getMyBookings(),
          getUserDetails()
        ]);
        setRooms(roomsResponse);
        setBookings(bookingsResponse);
        setIsAdmin(userResponse.is_admin);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data: " + (error.response?.data?.message || error.message));
        toast.error("Failed to fetch data: " + (error.response?.data?.message || error.message));
      }
    };
    fetchData();
  }, [navigate]);

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

        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p>{room.description}</p>
              <p className="font-bold">Price: ₹{room.price}</p>
              <p>Type: {room.room_type}</p>
              <p>AC: {room.is_ac ? "Yes" : "No"}</p>
              <p>Parking: {room.has_parking ? "Yes" : "No"}</p>
              <p>Status: {room.availability ? "Available" : "Booked"}</p>
              {room.availability && (
                <Link
                  to={`/dashboard/book-room/${room.id}`}
                  className="mt-2 inline-block bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Book Now
                </Link>
              )}
              {isAdmin && (
                <div className="mt-2">
                  <Link
                    to={`/dashboard/edit-room/${room.id}`}
                    className="mr-2 text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await deleteRoom(room.id);
                        setRooms(rooms.filter(r => r.id !== room.id));
                        toast.success("Room deleted successfully");
                      } catch (error) {
                        setError("Failed to delete room");
                        toast.error("Failed to delete room: " + (error.response?.data?.message || error.message));
                      }
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-center">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold">{booking.room_name}</h3>
                <p>Guest: {booking.guest_name}</p>
                <p>Government ID: {booking.government_id}</p>
                <p>Phone: {booking.phone_number}</p>
                <p>Start: {new Date(booking.start_date).toLocaleString()}</p>
                <p>End: {new Date(booking.end_date).toLocaleString()}</p>
                <p>Booked On: {new Date(booking.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;