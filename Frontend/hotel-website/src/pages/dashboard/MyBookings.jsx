import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings } from "../../api/auth"; // Adjusted path to auth.js
import { toast } from 'react-toastify';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your bookings.");
          navigate("/login");
          return;
        }
        const bookingsResponse = await getMyBookings();
        setBookings(bookingsResponse);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings: " + (err.response?.data?.message || err.message));
        toast.error("Failed to fetch bookings: " + (err.response?.data?.message || err.message));
        // If authentication fails, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchMyBookings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Bookings</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {bookings.length === 0 && !error ? (
          <p className="text-center text-gray-600 text-lg">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Room: {booking.room_name}</h3>
                <p className="text-gray-700 text-sm mb-1"><strong>Guest:</strong> {booking.guest_name}</p>
                <p className="text-gray-700 text-sm mb-1"><strong>Phone:</strong> {booking.phone_number}</p>
                <p className="text-gray-700 text-sm mb-1"><strong>Government ID:</strong> {booking.government_id}</p>
                <p className="text-gray-700 text-sm mb-1"><strong>Check-in:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm mb-1"><strong>Check-out:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm mt-3 font-semibold text-right">Booked On: {new Date(booking.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
