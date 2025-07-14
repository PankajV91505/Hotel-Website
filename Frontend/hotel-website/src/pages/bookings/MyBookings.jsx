import { useState, useEffect } from 'react';
import { getBookings, deleteBooking } from '../../api/bookings';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">Booking #{booking.id}</h2>
            <p>Room ID: {booking.room_id}</p>
            <p>Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
            <p>End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
            <p>Total Price: ${booking.total_price}</p>
            <button
              onClick={() => handleDelete(booking.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;