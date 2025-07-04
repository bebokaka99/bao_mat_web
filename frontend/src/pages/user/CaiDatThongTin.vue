<template>
  <div class="settings-page">
    <AppHeader />
    <main class="settings-container">
      <section class="settings-card">
        <h1 class="settings-title">Cài Đặt Thông Tin</h1>
        <form @submit.prevent="handleSubmit" class="settings-form">
          <div class="form-group avatar-group">
            <label class="form-label">Ảnh đại diện</label>
            <div class="avatar-preview">
              <img
                :src="avatarPreview || avatarUrl"
                alt="Avatar Preview"
                class="avatar-img"
                @error="handleAvatarError"
              />
              <input
                type="file"
                accept="image/jpeg,image/png"
                @change="handleAvatarChange"
                class="avatar-input"
                ref="avatarInput"
              />
              <button type="button" class="avatar-btn" @click="$refs.avatarInput.click()">
                <i class="fas fa-camera"></i> Chọn ảnh
              </button>
            </div>
            <span v-if="errors.avatar" class="error">{{ errors.avatar }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Họ và tên</label>
            <input
              type="text"
              v-model="form.full_name"
              class="form-input"
              placeholder="Nhập họ và tên"
              :class="{ 'is-invalid': errors.full_name }"
            />
            <span v-if="errors.full_name" class="error">{{ errors.full_name }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              v-model="form.email"
              class="form-input"
              placeholder="Nhập email"
              :class="{ 'is-invalid': errors.email }"
            />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <input
              type="text"
              v-model="form.phone"
              class="form-input"
              placeholder="Nhập số điện thoại"
              :class="{ 'is-invalid': errors.phone }"
            />
            <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Giới tính</label>
            <CustomSelect
              v-model="form.gender"
              :options="genderOptions"
              :is-invalid="!!errors.gender"
              placeholder="-- Chọn giới tính --"
            />
            <span v-if="errors.gender" class="error">{{ errors.gender }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              v-model="form.current_password"
              class="form-input"
              placeholder="Nhập mật khẩu hiện tại"
              :class="{ 'is-invalid': errors.current_password }"
            />
            <span v-if="errors.current_password" class="error">{{ errors.current_password }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu mới</label>
            <input
              type="password"
              v-model="form.new_password"
              class="form-input"
              placeholder="Nhập mật khẩu mới"
              :class="{ 'is-invalid': errors.new_password }"
            />
            <span v-if="errors.new_password" class="error">{{ errors.new_password }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              v-model="form.confirm_new_password"
              class="form-input"
              placeholder="Nhập lại mật khẩu mới"
              :class="{ 'is-invalid': errors.confirm_new_password }"
            />
            <span v-if="errors.confirm_new_password" class="error">{{ errors.confirm_new_password }}</span>
          </div>

          <div class="form-group agree-group">
            <label class="agree-label">
              <input
                type="checkbox"
                v-model="form.agree"
                :class="{ 'is-invalid': errors.agree }"
              />
              Đồng ý thay đổi thông tin
            </label>
            <span v-if="errors.agree" class="error">{{ errors.agree }}</span>
          </div>

          <button type="submit" class="submit-btn">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </form>
      </section>

      <div class="toast-container">
        <div
          v-for="(toast, index) in toasts"
          :key="index"
          :class="['toast', toast.type]"
          @click="removeToast(index)"
        >
          {{ toast.message }}
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getMe, updateMe, changePassword } from '@/api/authApi';
import AppHeader from '@/components/AppHeader.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'CaiDatThongTin',
  components: { AppHeader, CustomSelect, AppFooter },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({
      full_name: '',
      email: '',
      phone: '',
      gender: 'other',
      avatar: null,
      current_password: '',
      new_password: '',
      confirm_new_password: '',
      agree: false,
    });
    const originalForm = ref({});
    const avatarPreview = ref(null);
    const errors = ref({});
    const toasts = ref([]);
    
    const genderOptions = ref([
        { value: 'male', label: 'Nam' },
        { value: 'female', label: 'Nữ' },
        { value: 'other', label: 'Khác' },
    ]);

    onMounted(async () => {
      authStore.initialize();
      if (!authStore.token) {
        addToast('Vui lòng đăng nhập!', 'error');
        router.push('/dang-nhap');
        return;
      }
      try {
        const response = await getMe(authStore.token);
        authStore.setUser(response.user);
        form.value = {
          full_name: response.user.full_name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          gender: response.user.gender || 'other',
          avatar: null,
          current_password: '',
          new_password: '',
          confirm_new_password: '',
          agree: false,
        };
        originalForm.value = {
          full_name: response.user.full_name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          gender: response.user.gender || 'other',
        };
      } catch (error) {
        addToast(error.response?.data?.message || error.message, 'error');
        authStore.logout();
        router.push('/dang-nhap');
      }
    });

    const avatarUrl = computed(() => {
      const userAvatar = authStore.user?.avatar;
      return userAvatar && userAvatar !== '/uploads_img/avatar/default-avatar.jpg'
        ? `http://localhost:3000${userAvatar}`
        : 'http://localhost:3000/uploads_img/avatar/default-avatar.jpg';
    });

    const handleAvatarError = (event) => {
      event.target.src = 'http://localhost:3000/uploads_img/avatar/default-avatar.jpg';
    };

    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          errors.value.avatar = 'Chỉ hỗ trợ JPG/PNG';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          errors.value.avatar = 'Ảnh tối đa 5MB';
          return;
        }
        form.value.avatar = file;
        avatarPreview.value = URL.createObjectURL(file);
        errors.value.avatar = '';
      }
    };

    const addToast = (message, type) => {
      toasts.value.push({ message, type });
      setTimeout(() => {
        toasts.value.shift();
      }, 3000);
    };

    const removeToast = (index) => {
      toasts.value.splice(index, 1);
    };

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.full_name) {
        errors.value.full_name = 'Họ và tên không được để trống';
        isValid = false;
      } else if (form.value.full_name.length > 50) {
        errors.value.full_name = 'Họ và tên tối đa 50 ký tự';
        isValid = false;
      }

      if (!form.value.email) {
        errors.value.email = 'Email không được để trống';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Email không hợp lệ';
        isValid = false;
      }

      if (!form.value.phone) {
        errors.value.phone = 'Số điện thoại không được để trống';
        isValid = false;
      } else if (!/^0\d{9,10}$/.test(form.value.phone)) {
        errors.value.phone = 'Số điện thoại không hợp lệ';
        isValid = false;
      }

      if (!['male', 'female', 'other'].includes(form.value.gender)) {
        errors.value.gender = 'Vui lòng chọn giới tính';
        isValid = false;
      }

      if (form.value.current_password || form.value.new_password || form.value.confirm_new_password) {
        if (!form.value.current_password) {
          errors.value.current_password = 'Vui lòng nhập mật khẩu hiện tại';
          isValid = false;
        } else if (form.value.current_password.length < 6) {
          errors.value.current_password = 'Mật khẩu tối thiểu 6 ký tự';
          isValid = false;
        }

        if (!form.value.new_password) {
          errors.value.new_password = 'Vui lòng nhập mật khẩu mới';
          isValid = false;
        } else if (form.value.new_password.length < 6) {
          errors.value.new_password = 'Mật khẩu mới tối thiểu 6 ký tự';
          isValid = false;
        }

        if (!form.value.confirm_new_password) {
          errors.value.confirm_new_password = 'Vui lòng xác nhận mật khẩu mới';
          isValid = false;
        } else if (form.value.confirm_new_password !== form.value.new_password) {
          errors.value.confirm_new_password = 'Mật khẩu xác nhận không khớp';
          isValid = false;
        }
      }

      if (!form.value.agree) {
        errors.value.agree = 'Vui lòng đồng ý thay đổi';
        isValid = false;
      }

      return isValid;
    };

    const hasProfileChanged = () => {
      return (
        form.value.full_name !== originalForm.value.full_name ||
        form.value.email !== originalForm.value.email ||
        form.value.phone !== originalForm.value.phone ||
        form.value.gender !== originalForm.value.gender ||
        form.value.avatar !== null
      );
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        if (hasProfileChanged()) {
          const formData = new FormData();
          if (form.value.full_name !== originalForm.value.full_name)
            formData.append('full_name', form.value.full_name);
          if (form.value.email !== originalForm.value.email)
            formData.append('email', form.value.email);
          if (form.value.phone !== originalForm.value.phone)
            formData.append('phone', form.value.phone);
          if (form.value.gender !== originalForm.value.gender)
            formData.append('gender', form.value.gender);
          if (form.value.avatar) formData.append('avatar', form.value.avatar);

          if ([...formData.entries()].length > 0) {
            await updateMe(authStore.token, formData);
            const updatedUser = await getMe(authStore.token);
            authStore.setUser(updatedUser.user);
            addToast('Cập nhật thông tin thành công!', 'success');
            originalForm.value = {
              full_name: form.value.full_name,
              email: form.value.email,
              phone: form.value.phone,
              gender: form.value.gender,
            };
          }
        }

        if (form.value.current_password && form.value.new_password && form.value.confirm_new_password) {
          await changePassword(authStore.token, {
            current_password: form.value.current_password,
            new_password: form.value.new_password,
          });
          addToast('Đổi mật khẩu thành công!', 'success');
          form.value.current_password = '';
          form.value.new_password = '';
          form.value.confirm_new_password = '';
        }

        router.push('/user/thong-tin-ca-nhan');
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        addToast(message, 'error');
        if (message.includes('Token') || message.includes('đăng nhập')) {
          authStore.logout();
          router.push('/dang-nhap');
        }
      }
    };

    return {
      form,
      avatarPreview,
      avatarUrl,
      handleAvatarError,
      handleAvatarChange,
      handleSubmit,
      errors,
      toasts,
      removeToast,
      genderOptions,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.settings-page {
  min-height: 100vh;
  background: #1a1d29;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(34, 197, 94, 0.5);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fade-in 0.8s ease-in;
}

.settings-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 35px rgba(34, 197, 94, 0.35);
}

.settings-title {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 2rem;
  text-align: center;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #a3a3a3;
}

.form-input {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.form-input.is-invalid {
  border-color: #ef4444;
}

.avatar-group {
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.avatar-input {
  display: none;
}

.avatar-btn {
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-btn:hover {
  background: #22c55e;
  color: #ffffff;
}

.agree-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.agree-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  color: #ffffff;
}

.agree-label input {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #22c55e;
}

.error {
  color: #ef4444;
  font-family: 'Manrope', sans-serif;
  font-size: 0.85rem;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, #22c55e, #ffd700);
  color: #ffffff;
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

.submit-btn::after {
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

.submit-btn:hover::after {
  width: 250px;
  height: 250px;
}

.submit-btn i {
  margin-right: 0.5rem;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.toast {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  animation: slide-in 0.3s ease;
}

.toast.success {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.toast.error {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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
  .settings-container {
    padding: 1.5rem 1rem;
  }

  .settings-card {
    padding: 1.5rem;
  }

  .settings-title {
    font-size: 1.75rem;
  }

  .avatar-img {
    width: 80px;
    height: 80px;
  }

  .form-input,
  .avatar-btn {
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }

  .agree-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .settings-card {
    padding: 1rem;
  }

  .settings-title {
    font-size: 1.5rem;
  }

  .avatar-img {
    width: 60px;
    height: 60px;
  }

  .avatar-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .form-group {
    gap: 0.3rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .error {
    font-size: 0.8rem;
  }

  .submit-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .toast {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  .agree-label {
    font-size: 0.8rem;
  }
}
</style>