/* frontend/src/api/story.js */
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Dựa trên .env PORT=3000

// Tạm thời comment toàn bộ logic gọi API để tránh request liên tục
/*
// Lấy tất cả truyện
export const getAllStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/stories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

// Lấy danh sách chương theo truyện
export const getChaptersByStoryId = async (truyenId) => {
  try {
    const response = await axios.get(`${API_URL}/api/chapters/truyen/${truyenId}`);
    return response.data.chapters;
  } catch (error) {
    console.error(`Error fetching chapters for story ${truyenId}:`, error);
    throw error;
  }
};
*/

// Xuất hàm rỗng để tránh lỗi import
export const getAllStories = async () => [];
export const getChaptersByStoryId = async () => [];