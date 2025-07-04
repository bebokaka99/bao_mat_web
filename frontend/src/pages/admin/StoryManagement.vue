
<template>
  <div class="admin-page">
    <AppHeader />
    <main class="container">
      <h1><i class="fas fa-book-open"></i> Quản lý & Duyệt Truyện</h1>

      <div class="tabs">
        <button :class="{ active: activeTab === 'pending' }" @click="changeTab('pending')">
          <i class="fas fa-clock"></i> Chờ duyệt ({{ pendingCount }})
        </button>
        <button :class="{ active: activeTab === 'all' }" @click="changeTab('all')">
          <i class="fas fa-list"></i> Tất cả truyện
        </button>
      </div>

      <div class="content-layout">
        <div class="story-list-panel">
          <div v-if="isLoading" class="loading"><i class="fas fa-spinner fa-spin"></i> Đang tải danh sách...</div>
          <ul v-else class="story-list">
            <li
              v-for="story in stories"
              :key="story.id"
              @click="selectStory(story)"
              class="story-summary-card"
              :class="{ selected: selectedStory && selectedStory.id === story.id }"
            >
              <img :src="story.anh_bia ? `http://localhost:3000${story.anh_bia}` : defaultCover" alt="cover" class="summary-cover" />
              <div class="summary-info">
                <h3 class="summary-title"><i class="fas fa-book"></i> {{ story.ten_truyen }}</h3>
                <p class="summary-author">Tác giả: {{ story.tac_gia }}</p>
                <p class="summary-date">Ngày gửi: {{ new Date(story.thoi_gian_tao).toLocaleDateString() }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="story-detail-panel">
          <div v-if="!selectedStory" class="placeholder">
            <h3><i class="fas fa-info-circle"></i> Vui lòng chọn một truyện từ danh sách để xem chi tiết</h3>
          </div>
          <div v-else class="story-details">
            <div class="story-header">
              <h2>{{ selectedStory.ten_truyen }}</h2>
              <span :class="statusBadgeClass(selectedStory.trang_thai)">{{ selectedStory.trang_thai }}</span>
            </div>
            <p><strong>Tác giả:</strong> {{ selectedStory.tac_gia }}</p>
            <hr>
            <h4>Mô tả</h4>
            <p class="description">{{ selectedStory.mo_ta }}</p>
            <hr>
            <h4>Thông tin chi tiết</h4>
            <ul class="detail-list">
              <li><strong>Trạng thái:</strong> {{ selectedStory.trang_thai }}</li>
              <li><strong>Tình trạng viết:</strong> {{ selectedStory.trang_thai_viet }}</li>
              <li><strong>Yếu tố nhạy cảm:</strong> {{ selectedStory.yeu_to_nhay_cam ? 'Có' : 'Không' }}</li>
              <li><strong>Mục tiêu:</strong> {{ selectedStory.muc_tieu }}</li>
              <li><strong>Đối tượng:</strong> {{ selectedStory.doi_tuong_doc_gia }}</li>
              <li><strong>Link nguồn:</strong> <a :href="selectedStory.link_nguon" target="_blank">{{ selectedStory.link_nguon }}</a></li>
            </ul>
            <hr>
            <h4>Nội dung chương mẫu</h4>
            <div class="sample-content">
              <strong>{{ selectedStory.chuong_mau_tieu_de }}</strong>
              <p>{{ selectedStory.chuong_mau_noi_dung }}</p>
            </div>
            <hr>
            <div v-if="activeTab === 'pending'" class="admin-actions">
              <h4>Hành động</h4>
              <textarea v-model="adminNote" placeholder="Ghi chú của admin (ví dụ: lý do từ chối)..." rows="5"></textarea>
              <div class="action-buttons">
                <button class="btn-reject" @click="handleApproval('tu_choi')" title="Từ chối truyện">
                  <i class="fas fa-times-circle"></i> Từ chối
                </button>
                <button class="btn-approve" @click="handleApproval('duyet')" title="Duyệt truyện">
                  <i class="fas fa-check-circle"></i> Duyệt Truyện
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/auth';
import { getPendingStories, getAllStories, approveOrRejectStory } from '@/api/admin.js';
import { getStoryById } from '@/api/story.js';
import AppFooter from '@/components/AppFooter.vue';

const authStore = useAuthStore();
const defaultCover = 'http://localhost:3000/uploads_img/truyen/default-cover.jpg';

const activeTab = ref('pending');
const stories = ref([]);
const selectedStory = ref(null);
const isLoading = ref(false);
const adminNote = ref('');

const pendingCount = computed(() => {
  return Array.isArray(stories.value) ? stories.value.length : 0;
});

const fetchData = async () => {
  isLoading.value = true;
  selectedStory.value = null; 
  try {
    const apiCall = activeTab.value === 'pending' ? getPendingStories : getAllStories;
    const res = await apiCall(authStore.token);
    stories.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách truyện:", error);
    alert("Không thể tải danh sách truyện.");
    stories.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectStory = async (story) => {
  try {
    const res = await getStoryById(story.id);
    selectedStory.value = res.data;
    adminNote.value = ''; 
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết truyện:", error);
    alert("Không thể lấy chi tiết truyện.");
  }
};

const changeTab = (tabName) => {
  activeTab.value = tabName;
  fetchData();
};

const handleApproval = async (status) => {
  if (!selectedStory.value) return;
  if (status === 'tu_choi' && !adminNote.value) {
    alert('Vui lòng nhập lý do từ chối.');
    return;
  }

  const payload = {
    status: status,
    adminNote: adminNote.value,
  };

  try {
    await approveOrRejectStory(authStore.token, selectedStory.value.id, payload);
    alert(`Truyện đã được ${status === 'duyet' ? 'duyệt' : 'từ chối'} thành công!`);
    fetchData();
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái truyện:", error);
    alert("Có lỗi xảy ra, không thể cập nhật.");
  }
};

const statusBadgeClass = (status) => {
  return {
    'badge': true,
    'badge-pending': status === 'cho_duyet',
    'badge-approved': status === 'duyet',
    'badge-rejected': status === 'tu_choi',
  };
};

onMounted(fetchData);
</script>

<style scoped>
/* Import Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* General Styles */
.admin-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}

main.container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

h1 {
  text-align: center;
  color: #10b981;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background: #1e293b;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.tabs button:hover {
  background: #334155;
  color: #fff;
}

.tabs button.active {
  background: #10b981;
  color: #fff;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.content-layout {
  display: flex;
  gap: 1.5rem;
  flex-grow: 1;
  overflow: hidden;
}

.story-list-panel,
.story-detail-panel {
  background: #1e293b;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.story-list-panel {
  flex: 0 0 400px;
  overflow: hidden;
}

.story-detail-panel {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}

.story-list {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.story-list::-webkit-scrollbar,
.story-detail-panel::-webkit-scrollbar {
  width: 6px;
}

.story-list::-webkit-scrollbar-track,
.story-detail-panel::-webkit-scrollbar-track {
  background: transparent;
}

.story-list::-webkit-scrollbar-thumb,
.story-detail-panel::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 10px;
}

.story-list::-webkit-scrollbar-thumb:hover,
.story-detail-panel::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.story-summary-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #2d3748;
  margin-bottom: 0.5rem;
}

.story-summary-card:hover {
  background: #334155;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.story-summary-card.selected {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
}

.summary-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #475569;
}

.summary-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #10b981;
  font-size: 1.1rem;
  gap: 0.5rem;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.story-details .story-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.story-details h2 {
  color: #f1f5f9;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-pending {
  background: #f59e0b;
  color: #fff;
}

.badge-approved {
  background: #10b981;
  color: #fff;
}

.badge-rejected {
  background: #ef4444;
  color: #fff;
}

.story-details hr {
  border: none;
  border-top: 1px solid #374151;
  margin: 1.5rem 0;
}

.description {
  background: #111827;
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.7;
}

.detail-list {
  padding-left: 1.5rem;
  list-style: none;
}

.detail-list li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #d1d5db;
}

.detail-list li strong {
  color: #f1f5f9;
}

.sample-content {
  background: #111827;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #374151;
  margin-top: 1rem;
  color: #e2e8f0;
  line-height: 1.7;
  max-height: 300px;
  overflow-y: auto;
}

.sample-content::-webkit-scrollbar {
  width: 6px;
}

.sample-content::-webkit-scrollbar-track {
  background: transparent;
}

.sample-content::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 10px;
}

.sample-content::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.admin-actions {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #111827;
  border-radius: 8px;
  border: 1px solid #374151;
}

.admin-actions textarea {
  width: 100%;
  background: #1e293b;
  border: 1px solid #475569;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.admin-actions textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.action-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: pulse 1.5s infinite;
}

.btn-approve {
  background: #10b981;
  color: #fff;
}

.btn-reject {
  background: #ef4444;
  color: #fff;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
  }

  .story-list-panel {
    flex: none;
    max-height: 50vh;
  }

  .story-detail-panel {
    flex: none;
  }
}

@media (max-width: 768px) {
  main.container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .tabs button {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .story-summary-card {
    padding: 0.75rem;
  }

  .summary-cover {
    width: 50px;
    height: 70px;
  }

  .summary-info h3 {
    font-size: 0.95rem;
  }

  .summary-info p {
    font-size: 0.8rem;
  }

  .story-details h2 {
    font-size: 1.25rem;
  }

  .action-buttons button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
