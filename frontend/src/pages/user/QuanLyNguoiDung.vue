<template>
  <div class="user-management-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main content -->
    <main class="user-management-container">
      <section class="user-management-card">
        <h1 class="page-title">Quản lý người dùng</h1>

        <!-- Filter and Search -->
        <div class="filter-search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo username hoặc email..."
            class="search-input"
          />
          <select v-model="filterRole" class="filter-select">
            <option value="">Tất cả quyền</option>
            <option v-for="role in roles" :value="role" :key="role">{{ role }}</option>
          </select>
          <select v-model="filterStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">Đang tải...</div>

        <!-- User table -->
        <div v-else class="user-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span
                    class="role-badge"
                    :class="{
                      'role-user': user.role === 'user',
                      'role-author': user.role === 'author',
                      'role-admin': user.role === 'admin',
                    }"
                  >
                    <i
                      :class="{
                        'fas fa-user': user.role === 'user',
                        'fas fa-pen': user.role === 'author',
                        'fas fa-crown': user.role === 'admin',
                      }"
                    ></i>
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  {{ user.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                  {{ user.ban_until ? `đến ${formatDate(user.ban_until)}` : '' }}
                </td>
                <td>
                  <select
                    v-if="user.status === 'active'"
                    v-model="selectedBanDuration[user.id]"
                    class="ban-select"
                    @change="confirmLock(user.id, $event.target.value)"
                  >
                    <option value="" disabled selected>Chọn thời gian khóa</option>
                    <option value="1">1 ngày</option>
                    <option value="3">3 ngày</option>
                    <option value="5">5 ngày</option>
                    <option value="7">7 ngày</option>
                    <option value="30">30 ngày</option>
                    <option value="permanent">Vĩnh viễn</option>
                  </select>
                  <button
                    v-if="user.status !== 'active'"
                    @click="confirmUnlock(user.id)"
                    class="action-btn unlock-btn"
                  >
                    <i class="fas fa-unlock"></i> Mở khóa
                  </button>
                  <select
                    :value="user.role"
                    @change="confirmChangeRole(user.id, $event.target.value)"
                    class="role-select"
                  >
                    <option v-for="role in roles" :value="role" :key="role">
                      {{ role }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination">
            <button
              :disabled="page <= 1"
              @click="page--"
              class="pagination-btn"
            >
              <i class="fas fa-chevron-left"></i> Trước
            </button>
            <span class="pagination-info">Trang {{ page }} / {{ totalPages }}</span>
            <button
              :disabled="page >= totalPages"
              @click="page++"
              class="pagination-btn"
            >
              Tiếp <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import userApi from '@/api/user.api';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'QuanLyNguoiDung',
  components: { AppHeader },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const users = ref([]);
    const page = ref(1);
    const limit = 20;
    const total = ref(0);
    const loading = ref(false);
    const roles = ref(['user', 'author', 'admin']);
    const searchQuery = ref('');
    const filterRole = ref('');
    const filterStatus = ref('');
    const selectedBanDuration = ref({});

    const totalPages = computed(() => Math.ceil(total.value / limit));

    const filteredUsers = computed(() => {
      return users.value.filter((user) => {
        const matchesSearch =
          user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesRole = !filterRole.value || user.role === filterRole.value;
        const matchesStatus = !filterStatus.value || user.status === filterStatus.value;
        return matchesSearch && matchesRole && matchesStatus;
      });
    });

    onMounted(async () => {
      authStore.initialize();
      console.log('User role:', authStore.user?.role); // Debug
      if (authStore.user?.role !== 'admin') {
        alert('Bạn không có quyền truy cập!');
        router.push('/');
        return;
      }
      fetchUsers();
    });

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await userApi.getUsers(page.value, limit);
        console.log('API Response: Structure OK'); // Debug an toàn
        if (response?.data?.data) {
          users.value = response.data.data.users || [];
          total.value = response.data.data.total || 0;
          console.log('Users data:', users.value.map(u => ({ id: u.id, status: u.status, ban_until: u.ban_until }))); // Debug an toàn
        } else {
          throw new Error('Cấu trúc response không đúng');
        }
      } catch (error) {
        console.error('Fetch users error:', error);
        alert('Lỗi khi lấy danh sách người dùng: ' + (error.response?.data?.message || error.message));
        users.value = [];
        total.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const confirmLock = async (userId, duration) => {
      if (duration === '') return;
      const durations = {
        '1': 1,
        '3': 3,
        '5': 5,
        '7': 7,
        '30': 30,
        permanent: null,
      };
      const banUntil = duration !== 'permanent'
        ? new Date(Date.now() + durations[duration] * 24 * 60 * 60 * 1000).toISOString()
        : null;
      const message = duration !== 'permanent'
        ? `Bạn có chắc muốn khóa người dùng này trong ${duration} ngày?`
        : 'Bạn có chắc muốn khóa người dùng này vĩnh viễn?';
      if (confirm(message)) {
        try {
          console.log('Calling lockUser:', { userId, banUntil }); // Debug
          await userApi.lockUser(userId, banUntil);
          alert('Khóa người dùng thành công!');
          selectedBanDuration.value[userId] = '';
          fetchUsers();
        } catch (error) {
          console.error('Lock user error:', error);
          alert('Lỗi khi khóa người dùng: ' + (error.response?.data?.message || error.message));
        }
      }
    };

    const confirmUnlock = async (userId) => {
      if (confirm('Bạn có chắc muốn mở khóa người dùng này?')) {
        try {
          console.log('Calling unlockUser:', { userId }); // Debug
          await userApi.unlockUser(userId);
          alert('Mở khóa người dùng thành công!');
          fetchUsers();
        } catch (error) {
          console.error('Unlock user error:', error);
          alert('Lỗi khi mở khóa người dùng: ' + (error.response?.data?.message || error.message));
        }
      }
    };

    const confirmChangeRole = async (userId, role) => {
      if (confirm(`Bạn có chắc muốn đổi quyền thành ${role}?`)) {
        try {
          await userApi.updateRole(userId, role);
          alert('Cập nhật quyền thành công!');
          fetchUsers();
        } catch (error) {
          alert('Lỗi khi cập nhật quyền: ' + (error.response?.data?.message || error.message));
        }
      }
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    watch(page, fetchUsers);
    watch([searchQuery, filterRole, filterStatus], () => {
      page.value = 1;
    });

    return {
      users,
      filteredUsers,
      page,
      totalPages,
      loading,
      roles,
      searchQuery,
      filterRole,
      filterStatus,
      selectedBanDuration,
      confirmLock,
      confirmUnlock,
      confirmChangeRole,
      formatDate,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.user-management-page {
  min-height: 100vh;
  background: var(--bg-color, #1a1d29);
  color: var(--text-color, #ffffff);
  position: relative;
  overflow: hidden;
}

.user-management-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.user-management-card {
  backdrop-filter: blur(15px);
  border: 2px solid rgba(34, 197, 94, 0.5);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.35);
}

.page-title {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
  animation: fade-in 0.8s ease-in;
}

.filter-search {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.filter-select {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
}

.user-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Manrope', sans-serif;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(34, 197, 94, 0.3);
}

th {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-weight: 600;
  font-size: 1rem;
}

.user-row:hover {
  background: rgba(34, 197, 94, 0.1);
  transform: translateX(5px);
  transition: background 0.3s ease, transform 0.3s ease;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.role-badge i {
  margin-right: 0.5rem;
}

.role-user {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.role-user:hover {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.role-author {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid #eab308;
}

.role-admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.lock-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.lock-btn:hover {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

.unlock-btn {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.unlock-btn:hover {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.lock-btn i,
.unlock-btn i {
  margin-right: 0.5rem;
}

.ban-select,
.role-select {
  margin-left: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
}

.ban-select:hover,
.role-select:hover {
  background: rgba(34, 197, 94, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(34, 197, 94, 0.3);
}

.pagination-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.pagination-btn i {
  margin: 0 0.5rem;
}

.pagination-info {
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  color: #ffffff;
}

.loading {
  text-align: center;
  font-family: 'Manrope', sans-serif;
  font-size: 1.2rem;
  color: #22c55e;
  padding: 2rem;
}

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

@media (max-width: 768px) {
  .user-management-container {
    padding: 1.5rem 1rem;
  }

  .user-management-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .filter-search {
    flex-direction: column;
  }

  th,
  td {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .role-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .action-btn,
  .ban-select,
  .role-select {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .pagination {
    gap: 0.75rem;
  }

  .pagination-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .pagination-info {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .user-management-card {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  th,
  td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }

  .role-badge {
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
  }

  .action-btn,
  .ban-select,
  .role-select {
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
    margin: 0.5rem 0;
  }

  .pagination {
    flex-direction: column;
    align-items: center;
  }

  .pagination-btn {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }
}
</style>