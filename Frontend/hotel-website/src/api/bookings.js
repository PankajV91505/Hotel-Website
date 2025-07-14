import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getBookings = async () => {
  return axios.get(`${API_URL}/bookings/`, getAuthConfig()).then(res => res.data);
};

export const createBooking = async (data) => {
  return axios.post(`${API_URL}/bookings/`, data, getAuthConfig()).then(res => res.data);
};

export const getBooking = async (id) => {
  return axios.get(`${API_URL}/bookings/${id}`, getAuthConfig()).then(res => res.data);
};

export const deleteBooking = async (id) => {
  return axios.delete(`${API_URL}/bookings/${id}`, getAuthConfig()).then(res => res.data);
};