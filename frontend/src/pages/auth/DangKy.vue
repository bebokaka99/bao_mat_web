<!-- frontend/src/pages/auth/DangKy.vue -->
<template>
    <div class="dangky-container">
      <!-- Sử dụng component AppHeader -->
      <AppHeader />
  
      <!-- Nội dung chính -->
      <main class="main-content">
        <div class="khuVucForm">
          <router-link to="/">
            <img src="/logo.png" alt="TruyenVietHay Logo" class="login-logo" />
          </router-link>
          <h2 class="form-title">Đăng Ký Tài Khoản</h2>
          <p id="register-error" class="loi" v-if="errorMessage">{{ errorMessage }}</p>
          <form @submit.prevent="handleRegister">
            <div class="nhomForm">
              <div class="input-group">
                <input
                  type="text"
                  id="full_name"
                  v-model="fullName"
                  required
                  @focus="fullNameFocused = true"
                  @blur="fullNameFocused = false"
                />
                <label
                  for="full_name"
                  :class="{ 'active': fullName || fullNameFocused }"
                >
                  <i class="fas fa-user"></i> Họ và tên
                </label>
                <span class="loi" v-if="fullNameError">{{ fullNameError }}</span>
              </div>
            </div>
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
                  <i class="fas fa-id-badge"></i> Tên đăng nhập <span class="batBuoc">*</span>
                </label>
                <span class="loi" v-if="usernameError">{{ usernameError }}</span>
              </div>
            </div>
            <div class="nhomForm">
              <div class="input-group">
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  required
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
                <label
                  for="email"
                  :class="{ 'active': email || emailFocused }"
                >
                  <i class="fas fa-envelope"></i> Email <span class="batBuoc">*</span>
                </label>
                <span class="loi" v-if="emailError">{{ emailError }}</span>
              </div>
            </div>
            <div class="nhomForm">
              <div class="input-group">
                <input
                  type="text"
                  id="phone"
                  v-model="phone"
                  required
                  @focus="phoneFocused = true"
                  @blur="phoneFocused = false"
                />
                <label
                  for="phone"
                  :class="{ 'active': phone || phoneFocused }"
                >
                  <i class="fas fa-phone"></i> Số điện thoại <span class="batBuoc">*</span>
                </label>
                <span class="loi" v-if="phoneError">{{ phoneError }}</span>
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
                  <i class="fas fa-lock"></i> Mật khẩu <span class="batBuoc">*</span>
                </label>
                <button
                  type="button"
                  class="toggle-password"
                  @click="togglePassword('password')"
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
            <div class="nhomForm">
              <div class="input-group">
                <input
                  :type="confirmPasswordType"
                  id="confirm_password"
                  v-model="confirmPassword"
                  required
                  @focus="confirmPasswordFocused = true"
                  @blur="confirmPasswordFocused = false"
                />
                <label
                  for="confirm_password"
                  :class="{ 'active': confirmPassword || confirmPasswordFocused }"
                >
                  <i class="fas fa-lock"></i> Xác nhận mật khẩu <span class="batBuoc">*</span>
                </label>
                <button
                  type="button"
                  class="toggle-password"
                  @click="togglePassword('confirm_password')"
                >
                  <i
                    :class="[
                      'fas',
                      confirmPasswordType === 'password' ? 'fa-eye-slash' : 'fa-eye',
                    ]"
                  ></i>
                </button>
                <span class="loi" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
              </div>
            </div>
            <div class="nhomForm captcha-group">
              <div class="input-group">
                <input
                  type="text"
                  id="captcha"
                  v-model="captcha"
                  required
                  @focus="captchaFocused = true"
                  @blur="captchaFocused = false"
                />
                <label
                  for="captcha"
                  :class="{ 'active': captcha || captchaFocused }"
                >
                  <i class="fas fa-shield-alt"></i> Mã xác thực <span class="batBuoc">*</span>
                </label>
                <span class="loi" v-if="captchaError">{{ captchaError }}</span>
              </div>
              <div class="captcha-display" @click="refreshCaptcha">
                {{ captchaCode }}
                <i class="fas fa-sync-alt refresh-icon"></i>
              </div>
            </div>
            <div class="nhomForm terms-group">
              <label>
                <input type="checkbox" v-model="terms" required />
                Tôi đồng ý với <router-link to="/terms">điều khoản dịch vụ</router-link>.
              </label>
              <span class="loi" v-if="termsError">{{ termsError }}</span>
            </div>
            <button type="submit" class="login-btn ripple">Đăng Ký Ngay</button>
          </form>
          <div class="social-login">
            <p>Hoặc đăng ký bằng:</p>
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
            Đã có tài khoản? <router-link to="/dang-nhap">Đăng nhập ngay</router-link>
          </p>
        </div>
      </main>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { register } from "@/api/authApi";

export default {
  name: "DangKyPage",
  components: {
    AppHeader,
  },
  setup() {
    const router = useRouter();

    const fullName = ref("");
    const username = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const captcha = ref("");
    const terms = ref(false);

    const fullNameFocused = ref(false);
    const usernameFocused = ref(false);
    const emailFocused = ref(false);
    const phoneFocused = ref(false);
    const passwordFocused = ref(false);
    const confirmPasswordFocused = ref(false);
    const captchaFocused = ref(false);

    const passwordType = ref("password");
    const confirmPasswordType = ref("password");

    const errorMessage = ref("");
    const fullNameError = ref("");
    const usernameError = ref("");
    const emailError = ref("");
    const phoneError = ref("");
    const passwordError = ref("");
    const confirmPasswordError = ref("");
    const captchaError = ref("");
    const termsError = ref("");

    const captchaCode = ref(generateCaptcha());
    function generateCaptcha() {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    const refreshCaptcha = () => {
      captchaCode.value = generateCaptcha();
      captcha.value = "";
    };

    const togglePassword = (field) => {
      if (field === "password") {
        passwordType.value = passwordType.value === "password" ? "text" : "password";
      } else {
        confirmPasswordType.value = confirmPasswordType.value === "password" ? "text" : "password";
      }
    };

    const handleRegister = async () => {
      // Reset tất cả thông báo lỗi
      errorMessage.value = "";
      fullNameError.value = "";
      usernameError.value = "";
      emailError.value = "";
      phoneError.value = "";
      passwordError.value = "";
      confirmPasswordError.value = "";
      captchaError.value = "";
      termsError.value = "";

      // Kiểm tra dữ liệu đầu vào
      if (!fullName.value) {
        fullNameError.value = "Vui lòng nhập họ và tên";
        return;
      }

      if (!username.value) {
        usernameError.value = "Vui lòng nhập tên đăng nhập";
        return;
      }
      // Username: chỉ chứa ký tự thường không dấu, không khoảng trắng, dài 3-20 ký tự
      const usernameRegex = /^[a-z0-9]{3,20}$/;
      if (!usernameRegex.test(username.value)) {
        usernameError.value = "Tên đăng nhập chỉ chứa chữ thường, số, không dấu, dài 3-20 ký tự";
        return;
      }

      if (!email.value) {
        emailError.value = "Vui lòng nhập email";
        return;
      }
      // Email: đúng định dạng
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        emailError.value = "Email không hợp lệ (ví dụ: example@domain.com)";
        return;
      }

      if (!phone.value) {
        phoneError.value = "Vui lòng nhập số điện thoại";
        return;
      }
      // Số điện thoại: 10 chữ số, bắt đầu bằng 0
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone.value)) {
        phoneError.value = "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0";
        return;
      }

      if (!password.value) {
        passwordError.value = "Vui lòng nhập mật khẩu";
        return;
      }
      // Mật khẩu: tối thiểu 6 ký tự
      if (password.value.length < 6) {
        passwordError.value = "Mật khẩu phải có ít nhất 6 ký tự";
        return;
      }

      if (!confirmPassword.value) {
        confirmPasswordError.value = "Vui lòng xác nhận mật khẩu";
        return;
      }
      // Kiểm tra mật khẩu khớp
      if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = "Mật khẩu xác nhận không khớp với mật khẩu";
        return;
      }

      if (!captcha.value) {
        captchaError.value = "Vui lòng nhập mã xác thực";
        return;
      }
      // Kiểm tra captcha
      if (captcha.value !== captchaCode.value) {
        captchaError.value = "Mã xác thực không đúng, vui lòng thử lại";
        captchaCode.value = generateCaptcha();
        captcha.value = "";
        return;
      }

      if (!terms.value) {
        termsError.value = "Vui lòng đồng ý với điều khoản dịch vụ";
        return;
      }

      // Gửi yêu cầu đăng ký đến API
      try {
        const userData = {
          full_name: fullName.value,
          username: username.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
        };
        console.log("Sending register request with data:", userData);
        const response = await register(userData);
        errorMessage.value = response.message || "Đăng ký thành công!";
        setTimeout(() => router.push("/dang-nhap"), 1000);
      } catch (error) {
        console.error("Register failed:", error);
        // Hiển thị thông báo lỗi chi tiết từ backend
        if (error.message.includes("Thiếu thông tin đăng ký")) {
          errorMessage.value = "Thiếu thông tin đăng ký, vui lòng kiểm tra lại các trường";
        } else if (error.message.includes("Lỗi tạo user")) {
          errorMessage.value = "Lỗi hệ thống, không thể tạo tài khoản. Vui lòng thử lại sau";
        } else {
          errorMessage.value = error.message || "Đăng ký thất bại, vui lòng thử lại";
        }
      }
    };

    return {
      fullName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      captcha,
      terms,
      fullNameFocused,
      usernameFocused,
      emailFocused,
      phoneFocused,
      passwordFocused,
      confirmPasswordFocused,
      captchaFocused,
      passwordType,
      confirmPasswordType,
      errorMessage,
      fullNameError,
      usernameError,
      emailError,
      phoneError,
      passwordError,
      confirmPasswordError,
      captchaError,
      termsError,
      captchaCode,
      togglePassword,
      handleRegister,
      refreshCaptcha,
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
.dangky-container {
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
  background: #1a1d29;
  flex-grow: 1;
}

/* Container form */
.khuVucForm {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #1a1d29;
  border: 2px solid #4CAF50; /* Viền xanh lá */
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
  color: #4CAF50; /* Xanh lá */
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
  border-color: #388e3c; /* Xanh lá đậm hơn khi focus */
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
  outline: none;
}

/* Label động */
.input-group label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #cccccc; /* Xám nhạt */
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.input-group label i {
  color: #4CAF50; /* Icon xanh lá */
  font-size: 1rem;
}

.input-group label.active {
  top: -1px;
  left: 5px;
  font-size: 0.8rem;
  color: #4CAF50; /* Xanh lá khi active */
  background: #222; /* Nền xám đậm */
  padding: 0 5px;
  border-radius: 4px;
}

/* Dấu * bắt buộc */
.batBuoc {
  color: #d32f2f; /* Đỏ */
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
  color: #4CAF50; /* Icon xanh lá */
  font-size: 1rem;
}

.toggle-password:hover i {
  color: #388e3c; /* Xanh lá đậm hơn khi hover */
}

/* Nhóm captcha */
.captcha-group {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.captcha-group .input-group {
  flex: 1;
}

.captcha-group .input-group input {
  padding: 10px 10px 10px 30px;
}

.captcha-group .input-group label {
  left: 10px;
}

.captcha-group .input-group label.active {
  left: 5px;
}

.captcha-display {
  padding: 10px;
  background: #4CAF50; /* Nền xanh lá */
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 1rem;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
  user-select: none;
  cursor: pointer;
}

.captcha-display:hover {
  background: #388e3c; /* Xanh lá đậm hơn khi hover */
}

.refresh-icon {
  margin-left: 6px;
  font-size: 0.8rem;
}

/* Nhóm điều khoản */
.terms-group {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #cccccc; /* Xám nhạt */
  justify-content: center;
  margin-bottom: 15px;
}

.terms-group input[type="checkbox"] {
  margin: 0;
  accent-color: #4CAF50; /* Checkbox xanh lá */
}

.terms-group a {
  color: #4CAF50; /* Xanh lá */
  text-decoration: none;
}

.terms-group a:hover {
  color: #388e3c; /* Xanh lá đậm hơn khi hover */
  text-decoration: underline;
}

/* Nút Đăng ký */
.login-btn {
  width: 85%;
  margin: 0 auto;
  display: block;
  padding: 12px;
  background: linear-gradient(90deg, #4CAF50, #66BB6A); /* Gradient xanh lá */
  border: none;
  border-radius: 8px;
  color: #1a1a1a; /* Chữ đen */
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

/* Đăng ký mạng xã hội */
.social-login {
  margin: 15px 0;
  text-align: center;
}

.social-login p {
  font-size: 0.9rem;
  color: #cccccc; /* Xám nhạt */
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
  border: 1px solid #4CAF50; /* Viền xanh lá */
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
}

.social-btn:hover {
  background: #4CAF50; /* Nền xanh lá khi hover */
  color: #1a1a1a; /* Chữ đen */
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

/* Liên kết Đăng nhập */
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
  color: #388e3c; /* Xanh lá đym hơn khi hover */
  text-decoration: underline;
}

/* Thông báo lỗi */
.loi {
  color: #d32f2f; /* Đỏ cho lỗi */
  font-size: 0.8rem;
  margin-top: 4px;
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
    margin-top: 140px;
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

  .captcha-group {
    flex-direction: column;
    align-items: center;
  }

  .captcha-display {
    width: 90%;
  }

  .social-btn {
    width: 45%;
    padding: 8px;
    font-size: 0.8rem;
  }

  .login-link {
    font-size: 0.8rem;
  }
}
</style>