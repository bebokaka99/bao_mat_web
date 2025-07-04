# 📚 TruyenVietHay - Full Developer Documentation

## 1. Giới thiệu

**TruyenVietHay** là nền tảng đọc truyện online thân thiện người dùng, chuẩn SEO, hoạt động tốt trên cả mobile và desktop.

Tính năng nổi bật:
- Đọc truyện chữ mượt mà với giao diện cuộn
- Lưu lịch sử, đánh dấu yêu thích
- Hệ thống phân quyền: Guest / User / Author / Admin
- Author có thể đăng truyện, admin kiểm duyệt nội dung

---

## 2. 🧰 Tech Stack

| Layer      | Công nghệ sử dụng            |
|------------|------------------------------|
| Backend    | Node.js + Express            |
| Frontend   | Vue.js + Vite                |
| Database   | MySQL                        |
| Auth       | JWT (access & refresh token) |
| Triển khai | VPS / Shared Hosting (cPanel)|

---

## 3. 🧱 Kiến trúc hệ thống

```text
User (Guest / User / Author / Admin)
        |
        |--- HTTP Request (RESTful API - JWT Auth)
        |
Backend (Node.js + Express)
│
├── Controller Layer - Xử lý request/response
├── Service Layer    - Logic nghiệp vụ
├── Model Layer      - ORM thuần SQL (MySQL)
└── Middleware Layer - JWT Auth, Logger, Error Handler
        |
Database (MySQL)
        └── Lưu trữ toàn bộ dữ liệu
        |
Frontend (Vue.js + Vite)
├── UI/UX riêng
├── Call API Backend (Axios)
├── State management (Pinia)
└── Responsive + Darkmode + SEO/SSR
```

---

## 4. 🛡️ Phân quyền User

| Role   | Quyền hạn                                                                 |
|--------|---------------------------------------------------------------------------|
| Guest  | Đọc truyện, tìm kiếm                                                     |
| User   | Bình luận, đánh giá, follow, lưu lịch sử đọc                             |
| Author | Đăng truyện/chương (phải kiểm duyệt), quản lý truyện cá nhân            |
| Admin  | Toàn quyền: duyệt truyện, quản lý user, content, cấp quyền, chỉnh sửa DB|

---

## 5. ⚙️ Chức năng chính

### Đọc truyện
- Giao diện cuộn thân thiện
- Darkmode
- Lưu lịch sử đọc
- Theo dõi/yêu thích truyện
- Gợi ý truyện liên quan

### Upload truyện
- Author đăng truyện & chương qua trình soạn thảo
- Admin kiểm duyệt nội dung
- Hỗ trợ định dạng truyện đẹp (TinyMCE hoặc Composer)

---

## 6. 🧠 Gợi ý truyện thông minh

Tùy chỉnh theo user:
- Lịch sử đọc
- Thể loại yêu thích
- Tác giả đã follow
- Nếu chưa đủ dữ liệu: thêm trending / random

---

## 7. 🗂️ Cấu trúc thư mục (dev-friendly)

```bash
truyenviethay/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── home/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── user/
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   └── vite.config.js
```

---

## 8. 🗃️ Database (MySQL)

- Schema đầy đủ: `users`, `stories`, `chapters`, `comments`, `favorites`, `history`, `notifications`, `roles`, v.v.
- Tối ưu bằng index, chuẩn hóa
- Hỗ trợ migrate
- Chuẩn bị cho scale: nhiều tác giả, nhiều thể loại

---

## 9. 🌐 API Design

- RESTful API theo chuẩn `/api/v1/`
- Authentication bằng JWT: access + refresh token
- Middleware rõ ràng: xử lý lỗi, phân quyền
- Chuẩn bị sẵn cho tích hợp Mobile App Client

---

## 10. 🚀 Định hướng tương lai

- 📱 App Mobile (Flutter / Vue Native)
- 💸 Thanh toán / Donate (Momo, ZaloPay)
- 🔔 Realtime Notification
- ⚙️ SSR + chuẩn SEO
- 📈 Scale lớn: tách microservices

---

## 11. 💡 Coding Convention

- Viết **Clean Code**
- Comment đúng chỗ, không thừa
- Chia rõ controller / service / model
- Cấu trúc thư mục theo chức năng, dễ maintain

---

> 📩 Nếu bạn muốn đóng góp, mở PR hoặc liên hệ trực tiếp với mình qua email hoặc issue trên repo nhé!vvv
> 📩 
