import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, updateUserDetails } from '../api/auth';
import { toast } from 'react-toastify';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 22.9734,
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
  });
  const [position, setPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ phone_number: '', location: '' });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setPosition({ lat: latitude, lng: longitude });
            },
            () => toast.warn('Unable to detect location. Using default India map.')
          );
        }
      } catch (error) {
        toast.error('Failed to fetch user details');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await updateUserDetails({
        phoneNumber: editedUser.phone_number,
        location: editedUser.location,
      });
      toast.success('Profile updated successfully');
      setUser((prev) => ({
        ...prev,
        phone_number: editedUser.phone_number,
        location: editedUser.location,
      }));
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleContinue = () => {
    navigate('/dashboard/rooms');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Profile</h2>
        {loading || !isLoaded ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={user.first_name}
                  readOnly
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={user.last_name}
                  readOnly
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={editing ? editedUser.phone_number : user.phone_number}
                  readOnly={!editing}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone_number: e.target.value })
                  }
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={editing ? editedUser.location : user.location}
                  readOnly={!editing}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, location: e.target.value })
                  }
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    editing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />
              </div>
            </div>

            <div className="h-64">
              <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={5}>
                <Marker position={position} />
              </GoogleMap>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={handleContinue}
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
              >
                Continue to Dashboard
              </button>

              <button
                onClick={editing ? handleSave : () => setEditing(true)}
                className={`w-full ${
                  editing ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white p-2 rounded-md`}
              >
                {editing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
