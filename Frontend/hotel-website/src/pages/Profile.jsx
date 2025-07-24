import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { getUserDetails, updateUserDetails } from '../api/auth';
import { toast } from 'react-toastify';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaArrowRight } from 'react-icons/fa'; // Importing icons

const containerStyle = {
  width: '100%',
  height: '300px', // Increased height for better visibility
  borderRadius: '0.75rem', // Tailwind's rounded-xl
  overflow: 'hidden', // Ensure map corners are rounded
};

const defaultCenter = {
  lat: 22.9734, // Default to a central location in India
  lng: 78.6569,
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    location: '',
    is_admin: false, // Added is_admin to state
  });
  const [position, setPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ phone_number: '', location: '' });
  const [mapError, setMapError] = useState(false); // State to handle map loading errors

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // libraries: ['places'], // If you need place search functionality
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails();
        setUser(response);
        setEditedUser({
          phone_number: response.phone_number || '',
          location: response.location || '',
        });

        // Try to parse location if it's in "lat,lng" format
        if (response.location) {
          const [lat, lng] = response.location.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setPosition({ lat, lng });
          }
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setPosition({ lat: latitude, lng: longitude });
              toast.info('Your current location is shown on the map.');
            },
            (err) => {
              console.warn("Geolocation error:", err);
              toast.warn('Unable to detect your current location. Showing default map.');
            }
          );
        } else {
          toast.warn('Geolocation is not supported by your browser. Showing default map.');
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error('Failed to fetch user details. Please login again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    if (loadError) {
      setMapError(true);
      toast.error("Failed to load Google Maps. Please check your API key.");
      console.error("Google Maps loading error:", loadError);
    }
  }, [loadError]);


  const handleSave = async () => {
    setLoading(true); // Set loading for save operation
    try {
      const res = await updateUserDetails({
        phoneNumber: editedUser.phone_number,
        location: editedUser.location,
      });
      toast.success('Profile updated successfully!');
      setUser((prev) => ({
        ...prev,
        phone_number: editedUser.phone_number,
        location: editedUser.location,
      }));
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false); // Reset loading
    }
  };

  const handleContinue = () => {
    navigate('/dashboard/rooms');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          My Profile
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading user data...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={user.first_name}
                    readOnly
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                  />
                </div>
              </div>
              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={user.last_name}
                    readOnly
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-400" />
                  </span>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaPhone className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={editing ? editedUser.phone_number : user.phone_number}
                    readOnly={!editing}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone_number: e.target.value })
                    }
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                      editing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={editing ? editedUser.location : user.location}
                    readOnly={!editing}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, location: e.target.value })
                    }
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                      editing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full h-80 rounded-xl shadow-md overflow-hidden"> {/* Adjusted height */}
              {isLoaded && !mapError ? (
                <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={10}> {/* Increased zoom */}
                  <Marker position={position} />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600 rounded-xl">
                  {mapError ? "Map failed to load. Check API key." : "Loading Map..."}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                onClick={handleContinue}
                className="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FaArrowRight className="mr-2" /> Continue to Dashboard
              </button>

              <button
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={loading} // Disable button during save operation
                className={`w-full sm:w-1/2 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    editing
                      ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {editing ? <><FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Profile'}</> : <><FaEdit className="mr-2" /> Edit Profile</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
