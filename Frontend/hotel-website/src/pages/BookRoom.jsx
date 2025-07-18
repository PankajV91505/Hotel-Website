import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRooms, bookRoom } from "../api/auth";

function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestName, setGuestName] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response);
        if (id) {
          setRoomId(id);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to fetch rooms");
      }
    };
    fetchRooms();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await bookRoom({
        room_id: roomId,
        start_date: startDate,
        end_date: endDate,
        guest_name: guestName,
        government_id: governmentId,
        phone_number: phoneNumber
      });
      setMessage(response.message);
      setTimeout(() => navigate("/dashboard/rooms"), 2000);
    } catch (error) {
      console.error("Book room failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to book room. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Book Room</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <div className="bg-white p-6 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Select Room</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={!!id}
              >
                <option value="">Select a room</option>
                {rooms.filter(room => room.availability).map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value.trim())}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Government ID (e.g., Aadhaar, Passport)</label>
              <input
                type="text"
                value={governmentId}
                onChange={(e) => setGovernmentId(e.target.value.trim())}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                className="w-full p-2 border rounded"
                required
                pattern="[0-9]{10}"
                placeholder="1234567890"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Check-in Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Check-out Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Book Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookRoom;