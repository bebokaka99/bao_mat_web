<template>
  <div class="settings-page">
    <AppHeader />
    <main class="settings-container">
      <section class="settings-card">
        <h1 class="settings-title">Đăng Truyện Mới</h1>
        <form @submit.prevent="handleSubmit" class="settings-form">
          <div class="form-group">
            <label class="form-label"><i class="fas fa-pen-nib icon"></i> Tên truyện</label>
            <input v-model="form.title" class="form-input" placeholder="Nhập tên truyện" />
            <span v-if="errors.title" class="error">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-align-left icon"></i> Mô tả</label>
            <textarea v-model="form.description" class="form-input" rows="5" placeholder="Nhập mô tả truyện"></textarea>
            <span v-if="errors.description" class="error">{{ errors.description }}</span>
          </div>

          <div class="form-group avatar-group">
            <label class="form-label"><i class="fas fa-image icon"></i> Ảnh bìa</label>
            <div class="avatar-preview">
              <img :src="coverPreview || defaultCover" alt="Preview" class="avatar-img" />
              <input type="file" accept="image/*" class="avatar-input" @change="handleCoverChange" ref="coverInput" />
              <button type="button" class="avatar-btn" @click="$refs.coverInput.click()">
                <i class="fas fa-upload"></i> Chọn ảnh
              </button>
            </div>
            <span v-if="errors.cover" class="error">{{ errors.cover }}</span>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-tags icon"></i> Thể loại (có thể chọn nhiều)</label>
            <div class="genre-grid">
              <label v-for="tl in genres" :key="tl.id_theloai" class="genre-label">
                <input type="checkbox" :value="tl.id_theloai" v-model="form.genres" />
                <span class="genre-checkmark">{{ tl.ten_theloai }}</span>
              </label>
            </div>
            <span v-if="errors.genres" class="error">{{ errors.genres }}</span>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-check-circle icon"></i> Trạng thái truyện</label>
            <CustomSelect
              v-model="form.status"
              :options="[
                { value: 'Hoàn thành', label: 'Hoàn thành' },
                { value: 'Đang tiến hành', label: 'Đang tiến hành' }
              ]"
              placeholder="-- Chọn trạng thái --"
            />
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-edit icon"></i> Tình trạng viết</label>
            <CustomSelect
              v-model="form.writing_status"
              :options="[
                { value: 'Đang viết', label: 'Đang viết' },
                { value: 'Tạm ngừng', label: 'Tạm ngừng' }
              ]"
              placeholder="-- Chọn tình trạng --"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" v-model="form.sensitive" /> Có yếu tố nhạy cảm
            </label>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-bullseye icon"></i> Mục tiêu</label>
            <input v-model="form.target" class="form-input" placeholder="Ví dụ: Giải trí, nổi tiếng, học hỏi..." />
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-users icon"></i> Đối tượng độc giả</label>
            <input v-model="form.audience" class="form-input" placeholder="Ví dụ: Thiếu nhi, trưởng thành..." />
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-link icon"></i> Link nguồn (nếu có)</label>
            <input v-model="form.source_link" class="form-input" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-heading icon"></i> Tiêu đề chương mẫu</label>
            <input v-model="form.sample_title" class="form-input" placeholder="Chương 1: Khởi đầu..." />
          </div>

          <div class="form-group">
            <label class="form-label"><i class="fas fa-book-open icon"></i> Nội dung chương mẫu</label>
            <textarea v-model="form.sample_content" class="form-input" rows="6" placeholder="Nội dung chương đầu..."></textarea>
          </div>

          <div class="form-group agree-group">
            <label class="agree-label">
              <input type="checkbox" v-model="form.agree" /> Tôi xác nhận đăng truyện này
            </label>
            <span v-if="errors.agree" class="error">{{ errors.agree }}</span>
          </div>

          <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i> Đăng Truyện
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import CustomSelect from '@/components/CustomSelect.vue'; // <-- IMPORT COMPONENT MỚI
import { useAuthStore } from '@/stores/auth';
import { getAllGenres, createStory } from '@/api/story';

export default {
  name: 'DangTruyen',
  components: { AppHeader, CustomSelect }, // <-- ĐĂNG KÝ COMPONENT MỚI
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref({
      title: '',
      description: '',
      cover: null,
      genres: [], // <-- THAY ĐỔI: LƯU NHIỀU THỂ LOẠI
      status: 'Đang tiến hành',
      writing_status: 'Đang viết',
      sensitive: false,
      target: '',
      audience: '',
      source_link: '',
      sample_title: '',
      sample_content: '',
      agree: false,
    });

    const coverPreview = ref(null);
    const defaultCover = 'http://localhost:3000/uploads_img/truyen/default-cover.jpg';
    const genres = ref([]); // <-- Đây là danh sách thể loại từ API
    const errors = ref({});

    onMounted(async () => {
      try {
        const res = await getAllGenres();
        genres.value = res.data;
      } catch (err) {
        alert('Không thể tải danh sách thể loại');
      }
    });

    const handleCoverChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        errors.value.cover = 'Ảnh không hợp lệ';
        return;
      }
      form.value.cover = file;
      coverPreview.value = URL.createObjectURL(file);
      errors.value.cover = '';
    };

    const validateForm = () => {
      errors.value = {};
      let ok = true;
      if (!form.value.title) { errors.value.title = 'Vui lòng nhập tên truyện'; ok = false; }
      if (!form.value.description) { errors.value.description = 'Vui lòng nhập mô tả'; ok = false; }
      if (!form.value.cover) { errors.value.cover = 'Vui lòng chọn ảnh bìa'; ok = false; }
      if (form.value.genres.length === 0) { errors.value.genres = 'Vui lòng chọn ít nhất một thể loại'; ok = false; }
      if (!form.value.agree) { errors.value.agree = 'Bạn chưa xác nhận'; ok = false; }
      return ok;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      try {
        const data = new FormData();
        data.append('ten_truyen', form.value.title);
        data.append('mo_ta', form.value.description);
        data.append('anh_bia', form.value.cover);
        // THAY ĐỔI QUAN TRỌNG: Gửi mảng thể loại dưới dạng chuỗi JSON
        data.append('the_loai', JSON.stringify(form.value.genres));
        data.append('trang_thai', form.value.status);
        data.append('trang_thai_viet', form.value.writing_status);
        data.append('yeu_to_nhay_cam', form.value.sensitive ? '1' : '0');
        data.append('muc_tieu', form.value.target);
        data.append('doi_tuong_doc_gia', form.value.audience);
        data.append('link_nguon', form.value.source_link);
        data.append('chuong_mau_tieu_de', form.value.sample_title);
        data.append('chuong_mau_noi_dung', form.value.sample_content);

        await createStory(authStore.token, data);
        alert('Đăng truyện thành công và đang chờ duyệt!');
        router.push('/user/thong-tin-ca-nhan'); // Hoặc trang quản lý truyện
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi đăng truyện');
      }
    };

    return {
      form,
      genres,
      errors,
      coverPreview,
      defaultCover,
      handleCoverChange,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
/* CSS CŨ CỦA BẠN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.settings-page {
  background: #1a1d29;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.settings-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  position: relative;
  z-index: 1;
}

.settings-card {
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid #22c55e;
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: 0 8px 40px rgba(34, 197, 94, 0.3), inset 0 0 15px rgba(34, 197, 94, 0.15);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;
}

.settings-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 70%);
  transform: rotate(45deg);
  z-index: -1;
  transition: opacity 0.4s ease;
  opacity: 0.3;
}

.settings-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 50px rgba(34, 197, 94, 0.5);
}

.settings-card:hover::before {
  opacity: 0.6;
}

.settings-title {
  text-align: center;
  font-size: 2.75rem;
  font-weight: 800;
  color: #22c55e;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
  }
  to {
    text-shadow: 0 0 24px rgba(34, 197, 94, 0.9);
  }
}

.form-group {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  position: relative;
  transition: color 0.3s ease;
}

.form-label::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #22c55e;
  transition: width 0.3s ease;
}

.form-group:hover .form-label::after {
  width: 100%;
}

.form-input {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid #22c55e;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 5px rgba(34, 197, 94, 0.2);
}

.form-input:focus {
  border-color: #4ade80;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
  outline: none;
}

.form-input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.avatar-group .avatar-img {
  width: 180px;
  height: 180px;
  border: 3px solid #22c55e;
  border-radius: 1rem;
  object-fit: cover;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.avatar-group .avatar-img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.avatar-input {
  display: none;
}

.avatar-btn {
  background: linear-gradient(90deg, #22c55e, #4ade80);
  color: #1a1d29;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.avatar-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.4s ease;
}

.avatar-btn:hover::before {
  left: 100%;
}

.avatar-btn:hover {
  background: linear-gradient(90deg, #4ade80, #22c55e);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.6);
}

.agree-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
}

.error {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(90deg, #22c55e, #4ade80);
  color: #1a1d29;
  border: none;
  padding: 1rem 3rem;
  border-radius: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 2rem auto 0;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.4s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.7);
}

.submit-btn i {
  font-size: 1.5rem;
}

/* === CSS MỚI CHO THỂ LOẠI === */
.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #22c55e;
}

.genre-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.genre-label input[type="checkbox"] {
  display: none; /* Ẩn checkbox mặc định */
}

.genre-checkmark {
  padding: 0.5rem 1rem;
  border: 1px solid #4b5563;
  border-radius: 0.75rem;
  color: #d1d5db;
  font-weight: 500;
  text-align: center;
  width: 100%;
  transition: all 0.3s ease;
}

.genre-label input[type="checkbox"]:checked + .genre-checkmark {
  background-color: #22c55e;
  border-color: #4ade80;
  color: #1a1d29;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.genre-label:hover .genre-checkmark {
  border-color: #22c55e;
}
</style>