import axios from "axios";

// Create an axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// AUTH
export const signup = async ({ firstName, lastName, email, password }) => {
  const res = await API.post("/auth/signup", { firstName, lastName, email, password });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (email, otp, new_password) => {
  const res = await API.post("/auth/reset-password", { email, otp, new_password });
  return res.data;
};

export const googleLogin = async () => {
  window.location.href = `${API.defaults.baseURL}/auth/google`;
};

export const getUserDetails = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

// ROOMS
export const getRooms = async () => {
  const res = await API.get("/rooms");
  return res.data;
};

export const getRoom = async (id) => {
  const res = await API.get(`/rooms/${id}`);
  return res.data;
};

export const getRoomById = async (id) => {
  // Alias for getRoom (used in BookRoom.jsx)
  return await API.get(`/rooms/${id}`);
};

export const createRoom = async (roomData) => {
  const res = await API.post("/rooms", roomData);
  return res.data;
};

export const updateRoom = async (id, roomData) => {
  const res = await API.put(`/rooms/${id}`, roomData);
  return res.data;
};

export const deleteRoom = async (id) => {
  const res = await API.delete(`/rooms/${id}`);
  return res.data;
};

// BOOKINGS
export const bookRoom = async ({ room_id, start_date, end_date, guest_name, government_id, phone_number, amount, payment_id }) => {
  const res = await API.post("/bookings", {
    room_id,
    start_date,
    end_date,
    guest_name,
    government_id,
    phone_number,
    amount,
    payment_id,
  });
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/bookings/my-bookings");
  return res.data;
};

// UPDATE PROFILE
export const updateUserDetails = async ({ phoneNumber, location }) => {
  const res = await API.put("/auth/update-profile", {
    phone_number: phoneNumber,
    location: location,
  });
  return res.data;
};