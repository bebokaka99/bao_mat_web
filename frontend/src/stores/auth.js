// frontend/src/stores/auth.js
import { defineStore } from 'pinia';
import { getMe } from '@/api/authApi'; // Sửa tên file từ auth thành authApi

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    setUser(user) {
      this.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Lưu user vào localStorage
      } else {
        localStorage.removeItem('user');
      }
    },
    async initialize() {
      // Khôi phục token từ localStorage
      const token = localStorage.getItem('token');
      let user = localStorage.getItem('user');

      if (token) {
        this.token = token;

        // Khôi phục user từ localStorage nếu có
        if (user) {
          try {
            this.user = JSON.parse(user);
          } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            this.user = null;
            localStorage.removeItem('user'); // Xóa user nếu parse thất bại
          }
        }

        // Nếu không có user hoặc user không hợp lệ, gọi API getMe để lấy lại thông tin user
        if (!this.user) {
          try {
            const response = await getMe(this.token);
            this.setUser(response.user);
          } catch (error) {
            console.error('Failed to fetch user info during initialization:', error.message);
            // Nếu token không hợp lệ, đăng xuất
            this.logout();
          }
        }
      } else {
        // Nếu không có token, xóa user
        this.user = null;
        localStorage.removeItem('user');
      }

      console.log('Auth store initialized:', { token: this.token, user: this.user });
    },
    logout() {
      this.setToken(null);
      this.setUser(null); // Xóa cả token và user khỏi localStorage
    },
  },
});