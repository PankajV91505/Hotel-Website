import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms, deleteRoom, getUserDetails } from "../../api/auth"; // Updated path and added getUserDetails
import { toast } from 'react-toastify';
import { FaBed, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaParking, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa'; // Importing icons

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to store admin status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomsAndAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view rooms.");
          toast.error("Please log in to view rooms.");
          navigate("/login");
          return;
        }

        // Fetch rooms and user details in parallel
        const [roomsData, userData] = await Promise.all([
          getRooms(),
          getUserDetails()
        ]);

        setRooms(roomsData);
        setIsAdmin(userData.is_admin); // Set admin status
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch rooms or user details:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load rooms. Please try again.";
        setError(errorMessage);
        toast.error("Error: " + errorMessage);
        setLoading(false);
        // If authentication fails, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchRoomsAndAdminStatus();
  }, [navigate]);

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((room) => room.id !== id));
      toast.success("Room deleted successfully!");
    } catch (err) {
      console.error("Failed to delete room:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete room.";
      setError(errorMessage);
      toast.error("Error: " + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <FaSpinner className="animate-spin text-white text-4xl" />
        <p className="text-white text-xl ml-4">Loading Rooms...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">Available Rooms</h1>
          {isAdmin && (
            <Link
              to="/dashboard/add-room"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md text-lg font-semibold flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add New Room
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {rooms.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">No rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description || "No description provided."}</p>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-green-600 flex items-center">
                    <FaRupeeSign className="mr-1" /> {room.price}/night
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.availability ? "Available" : "Booked"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><strong>Type:</strong> {room.room_type || "N/A"}</p>
                  <p className="flex items-center">
                    <strong>AC:</strong> {room.is_ac ? <FaCheckCircle className="ml-2 text-green-500" /> : <FaTimesCircle className="ml-2 text-red-500" />}
                  </p>
                  <p className="flex items-center">
                    <strong>Parking:</strong> {room.has_parking ? <FaCheckCircle className="ml-2 text-green-500" /> : <FaTimesCircle className="ml-2 text-red-500" />}
                  </p>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {room.availability ? (
                    <Link
                      to={`/dashboard/book-room/${room.id}`}
                      className="w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-semibold shadow-md"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full text-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed shadow-md"
                    >
                      Not Available
                    </button>
                  )}

                  {isAdmin && (
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <Link
                        to={`/dashboard/edit-room/${room.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-semibold shadow-md flex items-center justify-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex-1 text-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 font-semibold shadow-md flex items-center justify-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
