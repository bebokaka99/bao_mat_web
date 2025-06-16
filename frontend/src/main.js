import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Khởi tạo ứng dụng Vue
const app = createApp(App);

// Khởi tạo Pinia
app.use(createPinia());

// Sử dụng router
app.use(router);

// Cấu hình TinyMCE self-hosted
app.config.globalProperties.$tinymceScriptSrc = '/tinymce/tinymce.min.js';

// Mount ứng dụng
app.mount("#app");