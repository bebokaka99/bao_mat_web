// frontend/src/api/admin.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

// Lấy danh sách truyện đang chờ duyệt
export const getPendingStories = (token) => {
  return axios.get(`${API_BASE}/story/cho-duyet`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Lấy tất cả truyện
export const getAllStories = (token) => {
    return axios.get(`${API_BASE}/story`, {
      headers: { Authorization: `Bearer ${token}` }
    });
};

// Duyệt hoặc từ chối truyện
export const approveOrRejectStory = (token, storyId, payload) => {
  // payload là object có dạng: { status: 'da_duyet' | 'tu_choi', adminNote: '...' }
  return axios.put(`${API_BASE}/story/${storyId}/duyet-or-tu_choi`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
};