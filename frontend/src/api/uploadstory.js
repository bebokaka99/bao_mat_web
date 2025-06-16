// frontend/src/api/uploadstory.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Thay đổi nếu backend của bạn chạy trên cổng hoặc host khác

const uploadStory = async (storyData) => {
  try {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage (ví dụ)
    const response = await axios.post(`${API_BASE_URL}/stories`, storyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Quan trọng khi gửi file ảnh
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng truyện:", error);
    throw error;
  }
};

const uploadCoverImage = async (formData) => {
  try {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage (ví dụ)
    const response = await axios.post(`${API_BASE_URL}/upload/story-cover`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải lên ảnh bìa:", error);
    throw error;
  }
};

export default {
  uploadStory,
  uploadCoverImage
};