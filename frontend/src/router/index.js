//Frontend src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/home/Home.vue';
import TruyenChuPage from '../pages/truyenchu/TruyenChu.vue';
import DangNhap from '../pages/auth/DangNhap.vue';
import DangKy from '../pages/auth/DangKy.vue';
import QuanLyNguoiDung from '../pages/user/QuanLyNguoiDung.vue';
import { useAuthStore } from '@/stores/auth';
import DangTruyen from '@/pages/user/DangTruyen.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/truyen-chu',
    name: 'TruyenChu',
    component: TruyenChuPage,
  },
  {
    path: '/truyen-moi',
    name: 'TruyenMoi',
    component: TruyenChuPage,
  },
  {
    path: '/stories/:id',
    name: 'StoryDetail',
    component: { template: '<div>Trang Chi Tiết Truyện (Chưa triển khai)</div>' },
  },
  {
    path: '/xep-hang',
    name: 'XepHang',
    component: TruyenChuPage,
  },
  {
    path: '/duyet-tim',
    name: 'DuyetTim',
    component: TruyenChuPage,
  },
  {
    path: '/truyen-viet',
    name: 'TruyenViet',
    component: TruyenChuPage,
  },
  {
    path: '/truyen-hot',
    name: 'TruyenHot',
    component: TruyenChuPage,
  },
  {
    path: '/dang-nhap',
    name: 'DangNhap',
    component: DangNhap,
    meta: { guestOnly: true },
  },
  {
    path: '/quen-mat-khau',
    name: 'QuenMatKhau',
    component: { template: '<div>Trang Quên Mật Khẩu (Chưa triển khai)</div>' },
  },
  {
    path: '/dang-ky',
    name: 'DangKy',
    component: DangKy,
    meta: { guestOnly: true },
  },
  {
    path: '/the-loai/:type',
    name: 'TheLoai',
    component: TruyenChuPage,
  },
  {
    path: '/user/thong-tin-ca-nhan',
    name: 'ThongTinCaNhan',
    component: () => import('../pages/user/ThongTinCaNhan.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user/truyen-theo-doi',
    name: 'TruyenTheoDoi',
    component: { template: '<div>Trang Truyện Theo Dõi (Chưa triển khai)</div>' },
    meta: { requiresAuth: true },
  },
  {
    path: '/user/lich-su-doc',
    name: 'LichSuDoc',
    component: { template: '<div>Trang Lịch Sử Đọc (Chưa triển khai)</div>' },
    meta: { requiresAuth: true },
  },
  {
    path: '/user/cai-dat-thong-tin',
    name: 'CaiDatThongTin',
    component: () => import('../pages/user/CaiDatThongTin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/quan-ly-nguoi-dung',
    name: 'QuanLyNguoiDung',
    component: QuanLyNguoiDung,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/dang-truyen',
    name: 'DangTruyen',
    component: DangTruyen,
    meta: {
      requiresAuth: true,
      roles: ['author', 'admin'],
    },
  },
  {
    path: '/admin/quan-ly-truyen',
    name: 'AdminStoryManagement',
    component: () => import('@/pages/admin/StoryManagement.vue'),
    meta: { requiresAuth: true, adminOnly: true } 
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initialize();

  if (to.meta.guestOnly && authStore.token) {
    alert('Bạn đã đăng nhập rồi!');
    return next({ name: 'TruyenChu' });
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'DangNhap' });
  }

  // Kiểm tra quyền hạn nếu có quy định roles
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    alert('Bạn không có quyền truy cập!');
    return next({ name: 'Home' });
  }

  if (to.meta.adminOnly && authStore.user?.role !== 'admin') {
    alert('Bạn không có quyền truy cập!');
    return next({ name: 'Home' });
  }

  next();
});

export default router;