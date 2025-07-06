<template>
  <div class="author-page">
    <AppHeader />
    <main class="container">
      <h1><i class="fas fa-book-medical"></i> Quản lý Truyện của tôi</h1>

      <div class="content-layout">
        <!-- Panel danh sách truyện -->
        <div class="story-list-panel">
          <div v-if="isLoading" class="loading"><i class="fas fa-spinner fa-spin"></i> Đang tải danh sách...</div>
          <div v-else-if="stories.length === 0" class="placeholder">
            <i class="fas fa-folder-open"></i> Bạn chưa đăng truyện nào.
          </div>
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
                <p class="summary-author">
                  Trạng thái: 
                  <span :class="statusBadgeClass(story.trang_thai_kiem_duyet)">
                    {{ formatApprovalStatus(story.trang_thai_kiem_duyet) }}
                  </span>
                </p>
                <p class="summary-date">Cập nhật: {{ new Date(story.thoi_gian_cap_nhat).toLocaleDateString() }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Panel chi tiết truyện -->
        <div class="story-detail-panel">
          <div v-if="!selectedStory" class="placeholder">
            <h3><i class="fas fa-info-circle"></i> Vui lòng chọn một truyện từ danh sách để xem chi tiết</h3>
          </div>
          <div v-else class="story-details">
            <div class="story-header">
              <h2>{{ selectedStory.ten_truyen }}</h2>
              <span :class="statusBadgeClass(selectedStory.trang_thai_kiem_duyet)">
                {{ formatApprovalStatus(selectedStory.trang_thai_kiem_duyet) }}
              </span>
            </div>
            
            <!-- Hiển thị ghi chú của Admin nếu bị từ chối -->
            <div v-if="selectedStory.trang_thai_kiem_duyet === 'tu_choi' && selectedStory.ghi_chu_admin" class="admin-note-rejected">
              <h4><i class="fas fa-comment-dots"></i> Ghi chú từ Admin:</h4>
              <p>{{ selectedStory.ghi_chu_admin }}</p>
            </div>

            <p><strong>Tác giả:</strong> {{ selectedStory.tac_gia }}</p>
            <hr>
            <h4>Mô tả</h4>
            <p class="description">{{ selectedStory.mo_ta }}</p>
            <hr>
            <h4>Thông tin chi tiết</h4>
            <ul class="detail-list">
              <li><strong>Trạng thái truyện:</strong> {{ selectedStory.trang_thai }}</li>
              <li><strong>Tình trạng viết:</strong> {{ selectedStory.trang_thai_viet }}</li>
              <li><strong>Yếu tố nhạy cảm:</strong> {{ selectedStory.yeu_to_nhay_cam ? 'Có' : 'Không' }}</li>
              <li><strong>Mục tiêu:</strong> {{ selectedStory.muc_tieu }}</li>
              <li><strong>Đối tượng:</strong> {{ selectedStory.doi_tuong_doc_gia }}</li>
              <li><strong>Link nguồn:</strong> <a :href="selectedStory.link_nguon" target="_blank">{{ selectedStory.link_nguon }}</a></li>
            </ul>
            
            <!-- Author Actions: Edit, Delete, Add Chapter -->
            <div class="author-actions">
              <button class="btn-action btn-edit"><i class="fas fa-edit"></i> Sửa truyện</button>
              <button class="btn-action btn-add-chapter"><i class="fas fa-plus-circle"></i> Thêm chương</button>
              <button class="btn-action btn-delete"><i class="fas fa-trash-alt"></i> Xóa truyện</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { useAuthStore } from '@/stores/auth';
import { getMyStories } from '@/api/author.js'; // Import API mới
import { getStoryById } from '@/api/story.js'; // Tái sử dụng API lấy chi tiết

const authStore = useAuthStore();
const defaultCover = 'http://localhost:3000/uploads_img/truyen/default-cover.jpg';

const stories = ref([]);
const selectedStory = ref(null);
const isLoading = ref(false);

const fetchData = async () => {
  isLoading.value = true;
  selectedStory.value = null; 
  try {
    const res = await getMyStories(authStore.token);
    // API trả về message nếu không có truyện, cần kiểm tra data có phải là array không
    stories.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách truyện của bạn:", error);
    alert("Không thể tải danh sách truyện của bạn.");
    stories.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectStory = async (story) => {
  try {
    // Tạm thời hiển thị dữ liệu đã có để nhanh hơn
    selectedStory.value = story; 
    // Sau đó fetch dữ liệu đầy đủ hơn (nếu cần)
    const res = await getStoryById(story.id);
    selectedStory.value = res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết truyện:", error);
    alert("Không thể lấy chi tiết truyện.");
  }
};

const formatApprovalStatus = (status) => {
  const statusMap = {
    cho_duyet: 'Chờ duyệt',
    duyet: 'Đã duyệt',
    tu_choi: 'Bị từ chối',
  };
  return statusMap[status] || status;
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
.author-page {
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
  color: #38bdf8; /* Light Blue for Author section */
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

.story-summary-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #2d3748;
  margin-bottom: 0.5rem;
  border-left: 4px solid transparent;
}

.story-summary-card:hover {
  background: #334155;
  transform: scale(1.02);
}

.story-summary-card.selected {
  background: rgba(56, 189, 248, 0.1);
  border-left: 4px solid #38bdf8;
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
}

.summary-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.loading, .placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  gap: 1rem;
}

.loading {
  color: #38bdf8;
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
  text-transform: capitalize;
}

.badge-pending { background: #f59e0b; color: #fff; }
.badge-approved { background: #10b981; color: #fff; }
.badge-rejected { background: #ef4444; color: #fff; }

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
  padding-left: 0;
  list-style: none;
}

.detail-list li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.detail-list li strong {
  color: #cbd5e1;
  min-width: 150px;
  display: inline-block;
}

.admin-note-rejected {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}
.admin-note-rejected h4 {
  color: #f87171;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.admin-note-rejected p {
  color: #e2e8f0;
  margin: 0;
  line-height: 1.6;
}

.author-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #374151;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-action {
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

.btn-edit { background: #3b82f6; color: #fff; }
.btn-add-chapter { background: #10b981; color: #fff; }
.btn-delete { background: #ef4444; color: #fff; }

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .content-layout { flex-direction: column; }
  .story-list-panel { flex: none; max-height: 50vh; }
  .story-detail-panel { flex: none; }
}

@media (max-width: 768px) {
  main.container { padding: 1rem; }
  h1 { font-size: 1.5rem; }
  .story-summary-card { padding: 0.75rem; }
  .summary-cover { width: 50px; height: 70px; }
  .summary-info h3 { font-size: 0.95rem; }
  .story-details h2 { font-size: 1.25rem; }
  .author-actions { flex-direction: column; }
  .btn-action { justify-content: center; }
}
</style>
