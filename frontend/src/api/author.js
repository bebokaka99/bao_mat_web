// frontend/src/api/author.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

/**
 * Lấy danh sách truyện của chính tác giả đang đăng nhập
 * @param {string} token - JWT token của người dùng
 * @returns {Promise}
 */
export const getMyStories = (token) => {
  return axios.get(`${API_BASE}/story/truyen-cua-toi`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
