<template>
  <div class="user-management-page">
    <AppHeader />

    <main class="user-management-container">
      <section class="user-management-card">
        <h1 class="page-title">Quản lý người dùng</h1>

        <div class="filter-search">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo username hoặc email..."
              class="search-input"
            />
          </div>
          <CustomSelect
            v-model="filterRole"
            :options="roleFilterOptions"
            placeholder="Tất cả quyền"
            class="filter-wrapper"
          />
          <CustomSelect
            v-model="filterStatus"
            :options="statusFilterOptions"
            placeholder="Tất cả trạng thái"
            class="filter-wrapper"
          />
        </div>

        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
        </div>

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
                  <span 
                    class="status-badge" 
                    :class="user.status === 'active' ? 'status-active' : 'status-blocked'">
                    {{ user.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                  </span>
                  <small v-if="user.ban_until" class="ban-until-text">
                    đến {{ formatDate(user.ban_until) }}
                  </small>
                </td>
                <td class="actions-cell">
                  <CustomSelect
                    v-if="user.status === 'active'"
                    :model-value="selectedBanDuration[user.id] || ''"
                    @update:modelValue="newValue => confirmLock(user.id, newValue)"
                    :options="banDurationOptions"
                    placeholder="Khóa tài khoản"
                    class="action-select"
                  />
                  <button
                    v-if="user.status !== 'active'"
                    @click="confirmUnlock(user.id)"
                    class="action-btn unlock-btn"
                  >
                    <i class="fas fa-unlock"></i> Mở khóa
                  </button>
                  <CustomSelect
                    :model-value="user.role"
                    @update:modelValue="newRole => confirmChangeRole(user.id, newRole)"
                    :options="userRoleOptions"
                    class="action-select"
                  />
                </td>
              </tr>
            </tbody>
          </table>

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
    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import userApi from '@/api/user.api';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import CustomSelect from '@/components/CustomSelect.vue';

export default {
  name: 'QuanLyNguoiDung',
  components: { AppHeader, AppFooter, CustomSelect },
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

    // Dữ liệu cho bộ lọc Quyền
    const roleFilterOptions = computed(() => [
      { value: '', label: 'Tất cả quyền' },
      ...roles.value.map(role => ({ value: role, label: role })),
    ]);

    // Dữ liệu cho bộ lọc Trạng thái
    const statusFilterOptions = ref([
      { value: '', label: 'Tất cả trạng thái' },
      { value: 'active', label: 'Hoạt động' },
      { value: 'blocked', label: 'Bị khóa' },
    ]);

    // Dữ liệu cho hành động Khóa tài khoản
    const banDurationOptions = ref([
      { value: '1', label: '1 ngày' },
      { value: '3', label: '3 ngày' },
      { value: '5', label: '5 ngày' },
      { value: '7', label: '7 ngày' },
      { value: '30', label: '30 ngày' },
      { value: 'permanent', label: 'Vĩnh viễn' },
    ]);
    
    // Dữ liệu cho hành động Đổi quyền
    const userRoleOptions = computed(() =>
      roles.value.map(role => ({ value: role, label: role }))
    );

    // --- Kết thúc phần thêm mới ---

    const totalPages = computed(() => Math.ceil(total.value / limit));

    const filteredUsers = computed(() => {
      // Logic lọc không thay đổi
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
      // Logic không thay đổi
      authStore.initialize();
      if (authStore.user?.role !== 'admin') {
        alert('Bạn không có quyền truy cập!');
        router.push('/');
        return;
      }
      fetchUsers();
    });

    const fetchUsers = async () => {
      // Logic không thay đổi
      loading.value = true;
      try {
        const response = await userApi.getUsers(page.value, limit);
        if (response?.data?.data) {
          users.value = response.data.data.users || [];
          total.value = response.data.data.total || 0;
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
      // Logic không thay đổi
      if (!duration) return; 
      const durations = {
        '1': 1, '3': 3, '5': 5, '7': 7, '30': 30, permanent: null,
      };
      const banUntil = duration !== 'permanent'
        ? new Date(Date.now() + durations[duration] * 24 * 60 * 60 * 1000).toISOString()
        : null;
      const message = duration !== 'permanent'
        ? `Bạn có chắc muốn khóa người dùng này trong ${duration} ngày?`
        : 'Bạn có chắc muốn khóa người dùng này vĩnh viễn?';
      if (confirm(message)) {
        try {
          await userApi.lockUser(userId, banUntil);
          alert('Khóa người dùng thành công!');
          selectedBanDuration.value[userId] = ''; // Reset select
          fetchUsers();
        } catch (error) {
          console.error('Lock user error:', error);
          alert('Lỗi khi khóa người dùng: ' + (error.response?.data?.message || error.message));
        }
      }
    };

    const confirmUnlock = async (userId) => {
      // Logic không thay đổi
      if (confirm('Bạn có chắc muốn mở khóa người dùng này?')) {
        try {
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
      // Logic không thay đổi
      const originalUser = users.value.find(u => u.id === userId);
      if (originalUser && originalUser.role === role) return; // Không làm gì nếu quyền không đổi

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
      // Logic không thay đổi
      if (!date) return '';
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
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
      roleFilterOptions,
      statusFilterOptions,
      banDurationOptions,
      userRoleOptions,
    };
  },
};
</script>

<style scoped>
/* Imports giữ nguyên */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* --- General Page Layout --- */
.user-management-page {
  min-height: 100vh;
  background: var(--bg-color, #1a1d29);
  color: var(--text-color, #ffffff);
  position: relative;
  overflow-x: hidden;
}

.user-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-management-card {
  background: rgba(26, 29, 41, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.3);
}

.page-title {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  animation: fade-in 0.8s ease-in;
}

/* --- Filter & Search --- */
.filter-search {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center; 
}

.search-wrapper {
  flex: 1;
  position: relative;
  min-width: 250px;
}

.filter-wrapper {
  width: 200px; 
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 1rem; 
  border-radius: 1rem; 
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid #22c55e; 
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 1rem; 
  transition: all 0.3s ease;
  box-shadow: inset 0 0 5px rgba(34, 197, 94, 0.2); 
  padding-left: 3.5rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  border-color: #4ade80;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
}

.search-input:focus + .search-icon {
    color: #34d399;
}

/* --- User Table --- */
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
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  vertical-align: middle;
}

th {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-row {
    transition: background-color 0.3s ease;
}

.user-row:hover {
  background: rgba(34, 197, 94, 0.08);
}

/* Badges */
.role-badge, .status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.role-badge i {
  margin-right: 0.5rem;
}

.role-user {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.role-author {
  background: rgba(234, 179, 8, 0.15);
  color: #facc15;
}

.role-admin {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.status-active {
  background-color: rgba(34, 197, 94, 0.15);
  color: #34d399;
}

.status-blocked {
  background-color: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.ban-until-text {
    display: block;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
}

.actions-cell {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-select {
  width: 150px;
}

.action-btn {
  padding: 0.9rem 1rem; 
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem; 
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  color: #ffffff;
}

.unlock-btn {
  border-color: #22c55e;
  color: #22c55e;
}

.unlock-btn:hover {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.unlock-btn i {
  margin-right: 0.5rem;
}

/* --- Pagination --- */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(34, 197, 94, 0.2);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem; 
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.pagination-btn:disabled {
  background: rgba(55, 65, 81, 0.2);
  border-color: rgba(55, 65, 81, 0.4);
  color: rgba(156, 163, 175, 0.5);
  cursor: not-allowed;
}

.pagination-info {
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  color: #ffffff;
}

/* --- Loading State --- */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid rgba(34, 197, 94, 0.2);
  border-top-color: #22c55e;
  animation: spin 1s linear infinite;
}

/* --- Animations --- */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .user-management-card { padding: 1.5rem; }
  .page-title { font-size: 1.75rem; }
  .filter-search { flex-direction: column; align-items: stretch;}
  .filter-wrapper { width: 100%; }
  th, td { padding: 0.75rem; font-size: 0.9rem; }
  .actions-cell { flex-direction: column; align-items: stretch; }
  .action-select { width: 100%; }
}

@media (max-width: 480px) {
  .user-management-card { padding: 1.5rem 1rem; }
  .page-title { font-size: 1.5rem; }
  .pagination { flex-direction: column; }
}

</style>