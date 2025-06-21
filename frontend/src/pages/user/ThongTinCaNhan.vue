<!-- frontend/src/pages/user/ThongTinCaNhan.vue -->
<template>
  <div class="profile-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main content -->
    <main class="profile-container">
      <!-- User card -->
      <section class="profile-card">
        <div class="profile-header">
          <!-- Avatar -->
          <div class="profile-avatar-wrapper">
            <img
              :src="avatarUrl"
              alt="User Avatar"
              class="profile-avatar"
              @error="handleAvatarError"
            />
          </div>

          <!-- User info -->
          <div class="profile-info">
            <h1 class="profile-name">{{ user?.full_name || 'Người dùng' }}</h1>
            <p class="profile-username">@{{ user?.username || 'username' }}</p>
          </div>
        </div>

        <!-- User details -->
        <div class="profile-details">
          <div class="detail-row">
            <i class="fas fa-envelope detail-icon"></i>
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ user?.email || 'Không có dữ liệu' }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-phone detail-icon"></i>
            <span class="detail-label">Số điện thoại</span>
            <span class="detail-value">{{ user?.phone || 'Không có dữ liệu' }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-venus-mars detail-icon"></i>
            <span class="detail-label">Giới tính</span>
            <span class="detail-value">{{ formatGender(user?.gender) || 'Không có dữ liệu' }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-calendar-alt detail-icon"></i>
            <span class="detail-label">Ngày tham gia</span>
            <span class="detail-value">{{ formatDate(user?.created_at) || 'Không có dữ liệu' }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-user-tag detail-icon"></i>
            <span class="detail-label">Vai trò</span>
            <span
              class="detail-value role-badge"
              :class="{
                'role-user': user?.role === 'user',
                'role-author': user?.role === 'author',
                'role-admin': user?.role === 'admin',
              }"
            >
              <i
                :class="{
                  'fas fa-user': user?.role === 'user',
                  'fas fa-pen': user?.role === 'author',
                  'fas fa-crown': user?.role === 'admin',
                }"
              ></i>
              {{ user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User' }}
            </span>
          </div>
        </div>

        <!-- Navigation tabs -->
        <div class="profile-nav">
          <router-link to="/user/cai-dat-thong-tin" class="profile-nav-tab">
            <i class="fas fa-cog"></i> Chỉnh sửa hồ sơ
          </router-link>
          <router-link to="/lich-su-doc" class="profile-nav-tab">
            <i class="fas fa-book-open"></i> Lịch sử đọc
          </router-link>
          <router-link to="/truyen-theo-doi" class="profile-nav-tab">
            <i class="fas fa-heart"></i> Truyện theo dõi
          </router-link>
          <!-- Nút Đăng Truyện - Chỉ hiển thị với author hoặc admin -->
          <router-link
            v-if="user?.role === 'author' || user?.role === 'admin'"
            to="/dang-truyen"
            class="profile-nav-tab"
          >
            <i class="fas fa-book"></i> Đăng Truyện
          </router-link>
                    <router-link
            v-if="user?.role === 'admin'"
            to="/quan-ly-nguoi-dung"
            class="profile-nav-tab"
          >
            <i class="fas fa-book"></i> Quản lý người dùng
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getMe } from '@/api/authApi';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'ThongTinCaNhan',
  components: { AppHeader },
  setup() {
    const authStore = useAuthStore();

    // Fetch user data on mount
    onMounted(async () => {
      authStore.initialize();
      if (authStore.token) {
        try {
          const response = await getMe(authStore.token);
          authStore.setUser(response.user);
        } catch (error) {
          console.error('Failed to fetch user info:', error.message);
          authStore.logout();
        }
      }
    });

    // Get user data from store
    const user = computed(() => authStore.user);

    // Compute avatar URL with fallback
    const avatarUrl = computed(() => {
      const userAvatar = authStore.user?.avatar;
      if (userAvatar && userAvatar !== '/uploads_img/avatar/default-avatar.jpg') {
        return `http://localhost:3000${userAvatar}`;
      }
      return 'http://localhost:3000/uploads_img/avatar/default-avatar.jpg';
    });

    // Handle avatar load error
    const handleAvatarError = (event) => {
      event.target.src = 'http://localhost:3000/uploads_img/avatar/default-avatar.jpg';
    };

    // Format date to Vietnamese format
    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Format gender to Vietnamese
    const formatGender = (gender) => {
      if (!gender) return null;
      const genderMap = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác',
      };
      return genderMap[gender] || 'Khác';
    };

    return {
      user,
      avatarUrl,
      handleAvatarError,
      formatDate,
      formatGender,
    };
  },
};
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600&display=swap');

/* Import Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Page wrapper */
.profile-page {
  min-height: 100vh;
  background: #1a1d29;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

/* Main container */
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Profile card */
.profile-card {
  backdrop-filter: blur(15px);
  border: 2px solid rgba(34, 197, 94, 0.5);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.35);
}

/* Profile header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 2rem;
}

/* Avatar */
.profile-avatar-wrapper {
  width: 160px;
  height: 160px;
  position: relative;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
  transition: box-shadow 0.3s ease;
}

.profile-avatar:hover {
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
}

/* User info */
.profile-info {
  flex: 1;
}

.profile-name {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  animation: fade-in 0.8s ease-in;
}

.profile-username {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  color: #22c55e;
  font-weight: 600;
}

/* User details */
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border-left: 4px solid #22c55e;
  transition: background 0.3s ease, transform 0.3s ease;
}

.detail-row:hover {
  background: rgba(34, 197, 94, 0.1);
  transform: translateX(5px);
}

.detail-icon {
  font-size: 1.5rem;
  color: #22c55e;
  margin-right: 1rem;
  animation: pulse 2s infinite;
}

.detail-label {
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  color: #a3a3a3;
  font-weight: 500;
  min-width: 140px;
}

.detail-value {
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge i {
  margin-right: 0.5rem;
}

.role-user {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  transition: box-shadow 0.3s ease;
}

.role-user:hover {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.role-author {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid #eab308;
  animation: pulse 2s infinite;
}

.role-admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
  transition: transform 0.3s ease;
}

.role-admin:hover {
  transform: scale(1.1);
}

/* Navigation tabs */
.profile-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(34, 197, 94, 0.3);
}

.profile-nav-tab {
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  border: 1px solid #22c55e;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-nav-tab:hover {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.profile-nav-tab::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.profile-nav-tab:hover::after {
  width: 250px;
  height: 250px;
}

.profile-nav-tab i {
  margin-right: 0.5rem;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .profile-avatar-wrapper {
    width: 140px;
    height: 140px;
  }

  .profile-name {
    font-size: 1.75rem;
  }

  .profile-username {
    font-size: 1.25rem;
  }

  .profile-details {
    gap: 1rem;
  }

  .detail-row {
    padding: 0.5rem 0.75rem;
  }

  .detail-icon {
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }

  .detail-label,
  .detail-value {
    font-size: 0.95rem;
  }

  .detail-label {
    min-width: 120px;
  }

  .role-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .profile-nav {
    gap: 1rem;
  }

  .profile-nav-tab {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 1rem;
  }

  .profile-avatar-wrapper {
    width: 120px;
    height: 120px;
  }

  .profile-name {
    font-size: 1.5rem;
  }

  .profile-username {
    font-size: 1rem;
  }

  .profile-nav {
    flex-direction: column;
    align-items: center;
  }

  .profile-nav-tab {
    width: 100%;
    max-width: 240px;
    text-align: center;
  }

  .detail-row {
    padding: 0.5rem;
  }

  .detail-icon {
    font-size: 1rem;
  }

  .detail-label,
  .detail-value {
    font-size: 0.9rem;
  }

  .detail-label {
    min-width: 100px;
  }

  .role-badge {
    padding: 0.3rem 0.7rem;
    font-size: 0.85rem;
  }
}
</style>