<!-- frontend/src/pages/auth/DangNhap.vue -->
<template>
  <div class="dangnhap-container">
    <!-- Sử dụng component AppHeader -->
    <AppHeader />

    <!-- Nội dung chính -->
    <main class="main-content">
      <div class="khuVucForm">
        <router-link to="/truyenchu">
          <img src="/logo.png" alt="TruyenVietHay Logo" class="login-logo" />
        </router-link>
        <h2 class="form-title">Đăng Nhập</h2>
        <p id="login-error" class="loi" v-if="errorMessage">{{ errorMessage }}</p>
        <form @submit.prevent="handleLogin">
          <div class="nhomForm">
            <div class="input-group">
              <input
                type="text"
                id="username"
                v-model="username"
                required
                @focus="usernameFocused = true"
                @blur="usernameFocused = false"
              />
              <label
                for="username"
                :class="{ 'active': username || usernameFocused }"
              >
                <i class="fas fa-id-badge"></i> Email hoặc Username
              </label>
              <span class="loi" v-if="usernameError">{{ usernameError }}</span>
            </div>
          </div>
          <div class="nhomForm">
            <div class="input-group">
              <input
                :type="passwordType"
                id="password"
                v-model="password"
                required
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
              <label
                for="password"
                :class="{ 'active': password || passwordFocused }"
              >
                <i class="fas fa-lock"></i> Mật khẩu
              </label>
              <button
                type="button"
                class="toggle-password"
                @click="togglePassword"
              >
                <i
                  :class="[
                    'fas',
                    passwordType === 'password' ? 'fa-eye-slash' : 'fa-eye',
                  ]"
                ></i>
              </button>
              <span class="loi" v-if="passwordError">{{ passwordError }}</span>
            </div>
          </div>
          <div class="nhomForm forgot-password">
            <div class="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                v-model="rememberMe"
              />
              <label for="remember-me">Ghi nhớ mật khẩu</label>
            </div>
            <router-link to="/quenmatkhau">Quên mật khẩu?</router-link>
          </div>
          <button type="submit" class="login-btn ripple">Đăng Nhập</button>
        </form>
        <div class="social-login">
          <p>Hoặc đăng nhập bằng:</p>
          <div class="social-buttons">
            <button class="social-btn facebook-btn ripple">
              <i class="fab fa-facebook-f"></i> Facebook
            </button>
            <button class="social-btn google-btn ripple">
              <i class="fab fa-google"></i> Google
            </button>
          </div>
        </div>
        <p class="login-link">
          Chưa có tài khoản?
          <router-link to="/dang-ky">Đăng ký ngay</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { login } from "@/api/authApi"; 
import { useAuthStore } from "@/stores/auth";

export default {
  name: "DangNhapPage",
  components: {
    AppHeader,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore(); 

    const username = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const passwordType = ref("password");
    const errorMessage = ref("");
    const usernameError = ref("");
    const passwordError = ref("");
    const usernameFocused = ref(false);
    const passwordFocused = ref(false);

    const togglePassword = () => {
      passwordType.value = passwordType.value === "password" ? "text" : "password";
    };

    const handleLogin = async () => {
      errorMessage.value = "";
      usernameError.value = "";
      passwordError.value = "";

      if (!username.value) {
        usernameError.value = "Vui lòng nhập email hoặc username";
        return;
      }
      if (!password.value) {
        passwordError.value = "Vui lòng nhập mật khẩu";
        return;
      }

      try {
        console.log("Attempting login for:", username.value);
        const response = await login({ username: username.value, password: password.value });
        authStore.setToken(response.token);
        authStore.setUser(response.user);
        errorMessage.value = response.message || "Đăng nhập thành công!";
        setTimeout(() => router.push("/truyen-chu"), 1000);
      } catch (error) {
        console.error("Login failed:", error);
        // Hiển thị thông báo lỗi chi tiết
        if (error.message.includes("Tài khoản hoặc mật khẩu không đúng")) {
          errorMessage.value = "Tài khoản hoặc mật khẩu không đúng, vui lòng kiểm tra lại";
        } else if (error.message.includes("Tài khoản hoặc mật khẩu không đúng")) {
          errorMessage.value = "Tài khoản hoặc mật khẩu không đúng, vui lòng kiểm tra lại";
        } else if (error.message.includes("Lỗi đăng nhập")) {
          errorMessage.value = "Lỗi hệ thống, không thể đăng nhập. Vui lòng thử lại sau";
        } else {
          errorMessage.value = error.message || "Đăng nhập thất bại, vui lòng thử lại";
        }
      }
    };

    return {
      username,
      password,
      rememberMe,
      passwordType,
      errorMessage,
      usernameError,
      passwordError,
      usernameFocused,
      passwordFocused,
      togglePassword,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Import Google Fonts cho typography */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

/* Đảm bảo không có viền trắng từ browser */
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

/* Container chính */
.dangnhap-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background: #1a1d29; 
  color: #ffffff;
  font-family: "Roboto", sans-serif;
}

/* Nội dung chính */
.main-content {
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

/* Container form */
.khuVucForm {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 2px solid #4CAF50; 
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.6s ease-out;
}

/* Logo */
.login-logo {
  width: 100px;
  margin: 0 auto 10px;
  display: block;
  transition: transform 0.3s ease;
}

.login-logo:hover {
  transform: scale(1.1);
}

/* Tiêu đề form */
.form-title {
  font-size: 2rem;
  font-weight: 600;
  color: #4CAF50; 
  margin-bottom: 15px;
  text-align: center;
}

/* Nhóm form */
.nhomForm {
  margin-bottom: 15px;
}

/* Nhóm input */
.input-group {
  position: relative;
  width: 100%;
}

.input-group input {
  width: 100%;
  padding: 10px 30px 10px 30px;
  border: 1px solid #4CAF50;
  border-radius: 8px;
  background: #1a1d29; 
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #388e3c; 
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
  outline: none;
}

/* Label động */
.input-group label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #cccccc;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.input-group label i {
  color: #4CAF50; 
  font-size: 1rem;
}

.input-group label.active {
  top: -1px;
  left: 5px;
  font-size: 0.8rem;
  color: #4CAF50; 
  background: #222; 
  padding: 0 5px;
  border-radius: 4px;
}

/* Toggle mật khẩu */
.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-password i {
  color: #4CAF50;
  font-size: 1rem;
}

.toggle-password:hover i {
  color: #388e3c; 
}

/* Ghi nhớ mật khẩu và Quên mật khẩu */
.forgot-password {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
}

.remember-me input[type="checkbox"] {
  margin: 0;
  accent-color: #4CAF50; 
}

.remember-me label {
  font-size: 0.9rem;
  color: #cccccc; 
}

.forgot-password a {
  font-size: 0.9rem;
  color: #4CAF50;
  text-decoration: none;
}

.forgot-password a:hover {
  color: #388e3c; 
  text-decoration: underline;
}

/* Nút Đăng nhập */
.login-btn {
  width: 85%;
  margin: 0 auto;
  display: block;
  padding: 12px;
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
  border: none;
  border-radius: 8px;
  color: #1a1a1a; 
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(90deg, #388e3c, #4CAF50);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

/* Đăng nhập mạng xã hội */
.social-login {
  margin: 15px 0;
  text-align: center;
}

.social-login p {
  font-size: 0.9rem;
  color: #cccccc; 
  margin-bottom: 10px;
}

.social-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.social-btn {
  width: 40%;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #4CAF50; 
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
}

.social-btn:hover {
  background: #4CAF50; 
  color: #1a1a1a;
}

.social-btn i {
  font-size: 1rem;
}

.facebook-btn {
  color: #ffffff;
}

.facebook-btn:hover {
  border-color: #4CAF50;
}

.google-btn {
  color: #ffffff;
}

.google-btn:hover {
  border-color: #4CAF50;
}

/* Liên kết Đăng ký */
.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #cccccc; /* Xám nhạt */
}

.login-link a {
  color: #4CAF50; /* Xanh lá */
  font-weight: 500;
  text-decoration: none;
}

.login-link a:hover {
  color: #388e3c;
  text-decoration: underline;
}

/* Thông báo lỗi */
.loi {
  color: #d32f2f; 
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 15px;
  display: block;
  text-align: center;
}

/* Hiệu ứng slide lên */
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hiệu ứng ripple */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: scale(0);
  animation: rippleEffect 0.5s ease-out;
  top: 50%;
  left: 50%;
  pointer-events: none;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }

  .khuVucForm {
    max-width: 90%;
    padding: 15px;
    border-width: 1px;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .login-logo {
    width: 80px;
  }

  .input-group input {
    max-width: 90%;
    padding: 8px 25px 8px 25px;
    font-size: 0.9rem;
  }

  .input-group label {
    left: 8px;
  }

  .input-group label.active {
    left: 4px;
    font-size: 0.7rem;
  }

  .toggle-password {
    right: 8px;
  }

  .login-btn {
    width: 90%;
    font-size: 1rem;
    padding: 10px;
  }

  .social-btn {
    width: 45%;
    padding: 8px;
    font-size: 0.8rem;
  }

  .forgot-password {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .login-link {
    font-size: 0.8rem;
  }
}
</style>