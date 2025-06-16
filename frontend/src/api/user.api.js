// frontend/src/api/user.api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Dùng proxy
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor để thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  getUsers: (page = 1, limit = 20) =>
    api.get(`/v1/users?page=${page}&limit=${limit}`),
  lockUser: (userId, banUntil = null) =>
    api.patch(`/v1/users/${userId}/lock`, { ban_until: banUntil }),
  unlockUser: (userId) =>
    api.patch(`/v1/users/${userId}/unlock`),
  updateRole: (userId, role) =>
    api.patch(`/v1/users/${userId}/role`, { role }),
};