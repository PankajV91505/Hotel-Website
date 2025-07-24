import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import { createRoom, getUserDetails, logout } from "../../api/auth"; // Import getUserDetails and logout
import { toast } from "react-toastify";
import { FaBed, FaAlignLeft, FaRupeeSign, FaDoorOpen, FaCheckSquare, FaParking, FaSpinner } from 'react-icons/fa'; // Importing icons

function AddRoom() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [roomType, setRoomType] = useState("");
  const [isAc, setIsAc] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Initial loading for admin check
  const [formSubmitting, setFormSubmitting] = useState(false); // Loading state for form submission
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in as an admin.");
          toast.error("Please log in to access this page.");
          navigate("/login");
          return;
        }

        const userResponse = await getUserDetails(); // Using the API function
        setIsAdmin(userResponse.is_admin);

        if (!userResponse.is_admin) {
          setError("Access Denied: Only admins can add rooms.");
          toast.error("You do not have administrative privileges to add rooms.");
          // Optionally redirect non-admins
          // navigate("/dashboard/rooms");
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError(err.response?.data?.message || "Failed to verify admin status. Please log in again.");
        toast.error("Error: " + (err.response?.data?.message || "Failed to verify admin status."));
        // If token is invalid or expired, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false); // Admin check is complete
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormSubmitting(true); // Set form submitting loading

    try {
      const response = await createRoom({
        name,
        description,
        price: parseFloat(price), // Ensure price is a number
        room_type: roomType,
        is_ac: isAc,
        has_parking: hasParking,
        availability
      });
      toast.success(response.message || "Room added successfully!");
      setTimeout(() => navigate("/dashboard/rooms"), 1500); // Shorter timeout
    } catch (err) {
      console.error("Add room failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to add room. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormSubmitting(false); // Reset form submitting loading
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-inter">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md text-lg font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Add New Room
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Room Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaBed className="text-gray-400" />
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="e.g., Deluxe King Room"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2 self-start">
                <FaAlignLeft className="text-gray-400" />
              </span>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y"
                placeholder="A brief description of the room..."
                rows="3"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaRupeeSign className="text-gray-400" />
              </span>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="e.g., 5000"
                required
                min="0"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomType">
              Room Type
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaDoorOpen className="text-gray-400" />
              </span>
              <select
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 bg-white appearance-none" // appearance-none to allow custom arrow
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAc"
                checked={isAc}
                onChange={(e) => setIsAc(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isAc" className="ml-2 text-gray-700 font-medium">
                <FaCheckSquare className="inline-block mr-1 text-indigo-500" /> Air Conditioning
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasParking"
                checked={hasParking}
                onChange={(e) => setHasParking(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="hasParking" className="ml-2 text-gray-700 font-medium">
                <FaParking className="inline-block mr-1 text-indigo-500" /> Parking Available
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="availability" className="ml-2 text-gray-700 font-medium">
                <FaCheckSquare className="inline-block mr-1 text-indigo-500" /> Available
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formSubmitting}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {formSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Adding Room...
              </>
            ) : (
              "Add Room"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
