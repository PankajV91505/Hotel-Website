import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getRooms = async () => {
  return axios.get(`${API_URL}/rooms/`).then(res => res.data);
};

export const createRoom = async (data) => {
  return axios.post(`${API_URL}/rooms/`, data, getAuthConfig()).then(res => res.data);
};

export const getRoom = async (id) => {
  return axios.get(`${API_URL}/rooms/${id}`).then(res => res.data);
};

export const updateRoom = async (id, data) => {
  return axios.put(`${API_URL}/rooms/${id}`, data, getAuthConfig()).then(res => res.data);
};

export const deleteRoom = async (id) => {
  return axios.delete(`${API_URL}/rooms/${id}`, getAuthConfig()).then(res => res.data);
};