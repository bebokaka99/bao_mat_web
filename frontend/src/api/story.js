// frontend/src/api/story.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

// Lấy danh sách thể loại
export const getAllGenres = () => axios.get('/api/v1/story/genres');

// Tạo truyện mới
export const createStory = (token, formData) => {
  return axios.post(`${API_BASE}/story`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
