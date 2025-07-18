import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../api/auth";

function AddRoom() {
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

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in as an admin");
          navigate("/login");
          return;
        }
        console.log("Sending token:", token);
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify admin status");
        }
        const data = await response.json();
        console.log("User data:", data);
        setIsAdmin(data.is_admin);
        if (!data.is_admin) {
          setError("Only admins can add rooms");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setError(error.message || "Please log in as an admin");
        navigate("/login");
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await createRoom({
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
      console.error("Add room failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to add room. Please try again.";
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add Room</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
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
              Add Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRoom;