// frontend/src/api/authApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/dang-ky', userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/dang-nhap', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

export const getMe = async (token) => {
  try {
    const response = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GetMe error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Lấy thông tin thất bại');
  }
};

export const updateMe = async (token, formData) => {
  try {
    const response = await apiClient.put('/auth/me', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('updateMe error:', error.response?.data?.message || error.message);
    if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra backend.');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Dữ liệu gửi lên không hợp lệ');
    }
    if (error.response?.status === 500) {
      throw new Error(error.response?.data?.message || 'Lỗi server khi xử lý FormData');
    }
    throw new Error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
  }
};

export const changePassword = async (token, passwordData) => {
  try {
    const response = await apiClient.post('/auth/change-password', passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('changePassword error:', error.response?.data?.message || error.message);
    if (error.response?.status === 404) {
      throw new Error('API đổi mật khẩu không tồn tại. Vui lòng kiểm tra backend.');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Dữ liệu mật khẩu không hợp lệ');
    }
    if (error.response?.status === 401) {
      throw new Error(error.response?.data?.message || 'Token không hợp lệ');
    }
    throw new Error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
  }
};