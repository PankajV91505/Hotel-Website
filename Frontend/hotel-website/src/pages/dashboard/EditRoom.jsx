import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoom, updateRoom } from "../../api/auth";

function EditRoom() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [roomType, setRoomType] = useState("");
  const [isAc, setIsAc] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in");
          navigate("/login");
          return;
        }
        const [roomResponse, userResponse] = await Promise.all([
          getRoom(id),
          fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json())
        ]);
        setName(roomResponse.name);
        setDescription(roomResponse.description);
        setPrice(roomResponse.price);
        setRoomType(roomResponse.room_type);
        setIsAc(roomResponse.is_ac);
        setHasParking(roomResponse.has_parking);
        setAvailability(roomResponse.availability);
        setIsAdmin(userResponse.is_admin);
        if (!userResponse.is_admin) setError("Only admins can edit rooms");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load room");
        navigate("/login");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await updateRoom(id, {
        name,
        description,
        price,
        room_type: roomType,
        is_ac: isAc,
        has_parking: hasParking,
        availability
      });
      setMessage(response.message);
      setTimeout(() => navigate("/dashboard/rooms"), 2000);
    } catch (error) {
      console.error("Update room failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to update room. Please try again.";
      setError(errorMessage);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Access Denied</h1>
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Room</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <div className="bg-white p-6 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
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
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Room Type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Twin">Twin</option>
                <option value="Queen">Queen</option>
                <option value="King">King</option>
                <option value="Suites">Suites</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Air Conditioning</label>
              <input
                type="checkbox"
                checked={isAc}
                onChange={(e) => setIsAc(e.target.checked)}
                className="p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Parking Available</label>
              <input
                type="checkbox"
                checked={hasParking}
                onChange={(e) => setHasParking(e.target.checked)}
                className="p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Availability</label>
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Update Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRoom;