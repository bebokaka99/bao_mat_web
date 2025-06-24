// frontend/src/api/story.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

// Lấy danh sách thể loại
export const getAllGenres = () => axios.get(`${API_BASE}/genres`);

// Lấy chi tiết truyện bằng ID
export const getStoryById = (storyId) => {
  return axios.get(`${API_BASE}/story/${storyId}`);
};


// Tạo truyện mới
export const createStory = (token, formData) => {
  return axios.post(`${API_BASE}/story`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Lấy truyện của tác giả đang đăng nhập
export const getMyStories = (token) => {
  return axios.get(`${API_BASE}/story/truyen-cua-toi`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};