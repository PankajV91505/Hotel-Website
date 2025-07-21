import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookRoom, getRoomById } from '../api/auth';
import { toast } from 'react-toastify';

const BookRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    guest_name: '',
    government_id: '',
    phone_number: '',
    amount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Debug environment variables
  useEffect(() => {
    console.log('VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  }, []);

  // Fetch room details on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getRoomById(id);
        setRoom(response.data);
        setFormData((prev) => ({ ...prev, amount: response.data.price }));
      } catch (error) {
        toast.error('Failed to fetch room details: ' + (error.response?.data?.message || error.message));
      }
    };
    fetchRoom();
  }, [id]);

  // Load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('razorpay-checkout')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  };

  // Handle form submission and payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.guest_name || !formData.government_id || !formData.phone_number || !formData.start_date || !formData.end_date) {
        throw new Error('All fields are required');
      }
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      if (startDate >= endDate) {
        throw new Error('Check-out date must be after check-in date');
      }
      if (startDate < today.setHours(0, 0, 0, 0)) {
        throw new Error('Check-in date cannot be in the past');
      }

      // Validate Razorpay key
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay API key is missing. Please check your .env file.');
      }

      // Load Razorpay script
      await loadRazorpayScript();

      // Create Razorpay order
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in.');
      }

      const orderResponse = await fetch('http://localhost:5000/api/bookings/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: formData.amount }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order: ' + (await orderResponse.text()));
      }

      const order = await orderResponse.json();
      if (!order.success) {
        throw new Error(order.message || 'Order creation failed');
      }

      // Initialize Razorpay payment
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'Hotel Booking',
        description: `Booking for ${room?.name}`,
        handler: async (response) => {
          try {
            const bookingData = {
              room_id: id,
              start_date: formData.start_date,
              end_date: formData.end_date,
              guest_name: formData.guest_name,
              government_id: formData.government_id,
              phone_number: formData.phone_number,
              amount: formData.amount,
              payment_id: response.razorpay_payment_id,
            };
            const bookingResponse = await bookRoom(bookingData);
            toast.success('Room booked successfully!');
            navigate('/dashboard/rooms');
          } catch (error) {
            toast.error('Booking failed: ' + (error.response?.data?.message || error.message));
          }
        },
        prefill: {
          name: formData.guest_name,
          contact: formData.phone_number,
        },
        theme: { color: '#4F46E5' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Payment initiation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Book Room: {room?.name || 'Loading...'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Guest Name</label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Government ID</label>
            <input
              type="text"
              name="government_id"
              value={formData.government_id}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              readOnly
              className="mt-1 block w-full p-2 border rounded-md bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !room}
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay and Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRoom;