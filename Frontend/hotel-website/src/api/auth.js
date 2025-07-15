import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const signup = async ({ firstName, lastName, email, password }) => {
  return axios.post(`${API_URL}/auth/signup`, {
    first_name: firstName,
    last_name: lastName,
    email,
    password
  });
};

export const verifyOtp = async (email, otp) => {
  return axios.post(`${API_URL}/auth/verify-otp`, { email, otp }).then(res => res.data);
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password }).then(res => res.data);
};

export const forgotPassword = async (email) => {
  return axios.post(`${API_URL}/auth/forgot-password`, { email }).then(res => res.data);
};

export const resetPassword = async (email, otp, new_password) => {
  return axios.post(`${API_URL}/auth/reset-password`, { email, otp, new_password }).then(res => res.data);
};

export const getRooms = async () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const createRoom = async (roomData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/rooms`, roomData, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const getRoom = async (id) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/rooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const updateRoom = async (id, roomData) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/rooms/${id}`, roomData, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const deleteRoom = async (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/rooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};