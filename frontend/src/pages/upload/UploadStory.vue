<template>
  <div>
    <AppHeader />
    <div class="upload-story-container">
      <h1>Đăng Truyện Mới</h1>
      <form @submit.prevent="submitStory">
        <div class="form-group">
          <label for="ten_truyen">Tên Truyện:</label>
          <input type="text" id="ten_truyen" v-model="form.ten_truyen" required>
        </div>

        <div class="form-group">
          <label for="the_loai">Thể Loại:</label>
          <input type="text" id="the_loai" v-model="form.the_loai">
          <small class="form-text text-muted">Có thể nhập nhiều thể loại, cách nhau bởi dấu phẩy.</small>
        </div>

        <div class="form-group">
          <label for="mo_ta">Mô Tả:</label>
          <textarea id="mo_ta" v-model="form.mo_ta" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="trang_thai">Trạng Thái:</label>
          <select id="trang_thai" v-model="form.trang_thai">
            <option value="dang_ra">Đang Ra</option>
            <option value="hoan_thanh">Hoàn Thành</option>
            <option value="tam_ngung">Tạm Ngưng</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tinh_trang">Tình Trạng:</label>
          <select id="tinh_trang" v-model="form.tinh_trang">
            <option value="free">Free</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div class="form-group">
          <label for="trang_thai_viet">Trạng Thái Viết:</label>
          <select id="trang_thai_viet" v-model="form.trang_thai_viet">
            <option value="ban_nhap">Bản Nháp</option>
            <option value="dang_cong_khai">Đăng Công Khai</option>
          </select>
        </div>

        <div class="form-group">
          <label for="yeu_to_nhay_cam">Yếu Tố Nhạy Cảm:</label>
          <input type="text" id="yeu_to_nhay_cam" v-model="form.yeu_to_nhay_cam">
        </div>

        <div class="form-group">
          <label for="link_nguon">Link Nguồn (nếu có):</label>
          <input type="url" id="link_nguon" v-model="form.link_nguon">
        </div>

        <div class="form-group">
          <label for="muc_tieu">Mục Tiêu:</label>
          <input type="text" id="muc_tieu" v-model="form.muc_tieu">
        </div>

        <div class="form-group">
          <label for="doi_tuong_doc_gia">Đối Tượng Đọc Giả:</label>
          <input type="text" id="doi_tuong_doc_gia" v-model="form.doi_tuong_doc_gia">
        </div>

        <div class="form-group">
          <label for="anh_bia">Ảnh Bìa:</label>
          <input type="file" id="anh_bia" @change="handleCoverImageUpload" accept="image/*" required>
          <div v-if="coverPreview" class="cover-preview">
            <img :src="coverPreview" alt="Ảnh Bìa Preview" style="max-width: 200px; height: auto;">
          </div>
        </div>

        <div class="form-group">
          <label for="chuong_mau_tieu_de">Tiêu Đề Chương Mẫu:</label>
          <input type="text" id="chuong_mau_tieu_de" v-model="form.chuong_mau_tieu_de" required>
        </div>

        <div class="form-group">
          <label for="chuong_mau_noi_dung">Nội Dung Chương Mẫu:</label>
          <CKEditor v-model="form.chuong_mau_noi_dung" :config="ckeditorConfig"></CKEditor>
        </div>

        <button type="submit" class="btn btn-primary">Đăng Truyện</button>
        <div v-if="uploadSuccess" class="alert alert-success mt-3">{{ uploadSuccess }}</div>
        <div v-if="uploadError" class="alert alert-danger mt-3">{{ uploadError }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { CKEditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import uploadStoryApi from '@/api/uploadstory';

export default {
  components: {
    AppHeader,
    CKEditor
  },
  setup() {
    const toast = useToast();
    const form = ref({
      ten_truyen: '',
      the_loai: '',
      mo_ta: '',
      trang_thai: 'dang_ra',
      tinh_trang: 'free',
      trang_thai_viet: 'ban_nhap',
      yeu_to_nhay_cam: '',
      link_nguon: '',
      muc_tieu: '',
      doi_tuong_doc_gia: '',
      anh_bia: null,
      chuong_mau_tieu_de: '',
      chuong_mau_noi_dung: ''
    });
    const coverPreview = ref(null);
    const uploadSuccess = ref('');
    const uploadError = ref('');
    const ckeditorConfig = {
      // Các tùy chọn cấu hình CKEditor nếu cần
    };
    const coverFile = ref(null);

    const handleCoverImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        form.value.anh_bia = file;
        coverFile.value = file;
        coverPreview.value = URL.createObjectURL(file);
      } else {
        form.value.anh_bia = null;
        coverFile.value = null;
        coverPreview.value = null;
      }
    };

    const submitStory = async () => {
      uploadSuccess.value = '';
      uploadError.value = '';

      const formData = new FormData();
      for (const key in form.value) {
        formData.append(key, form.value[key]);
      }

      try {
        const response = await uploadStoryApi.uploadStory(formData);
        uploadSuccess.value = response.message || 'Đăng truyện thành công và đang chờ duyệt!';
        toast.success(uploadSuccess.value);
        // Reset form sau khi thành công nếu cần
        form.value = {
          ten_truyen: '',
          the_loai: '',
          mo_ta: '',
          trang_thai: 'dang_ra',
          tinh_trang: 'free',
          trang_thai_viet: 'ban_nhap',
          yeu_to_nhay_cam: '',
          link_nguon: '',
          muc_tieu: '',
          doi_tuong_doc_gia: '',
          anh_bia: null,
          chuong_mau_tieu_de: '',
          chuong_mau_noi_dung: ''
        };
        coverPreview.value = null;
      } catch (error) {
        uploadError.value = error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng truyện.';
        toast.error(uploadError.value);
      }
    };

    return {
      form,
      coverPreview,
      uploadSuccess,
      uploadError,
      ckeditorConfig,
      handleCoverImageUpload,
      submitStory
    };
  }
};
</script>

<style scoped>
.upload-story-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="url"],
select,
textarea,
input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.cover-preview {
  margin-top: 10px;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 4px;
}
</style>