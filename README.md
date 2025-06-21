# 📚 TruyenVietHay - Fullstack Web Reading Platform

TruyenVietHay là một nền tảng đọc truyện online hiện đại, thân thiện người dùng, hỗ trợ đa thiết bị và tối ưu SEO. Dự án hướng tới việc cung cấp trải nghiệm đọc truyện mượt mà, tiện lợi và mở rộng khả năng sáng tác, chia sẻ truyện cho cộng đồng tác giả Việt.

---

## 🚀 Giới thiệu
Người dùng có thể:
- Đọc truyện, lưu lịch sử, đánh dấu yêu thích
- Bình luận, đánh giá và theo dõi truyện
- Đối với Author: đăng truyện, viết chương mới (duyệt bởi Admin)
- Admin có quyền kiểm duyệt, quản lý người dùng, nội dung và hệ thống

---

## 🛠️ Tech Stack

| Layer     | Công nghệ sử dụng            |
|-----------|------------------------------|
| Backend   | Node.js + Express            |
| Frontend  | Vue.js + Vite                |
| Database  | MySQL                        |
| Auth      | JWT (Access & Refresh Token) |
| Triển khai| VPS / Shared Hosting (cPanel)|

---

## 🧩 Kiến trúc hệ thống

```
User (Guest / User / Author / Admin)
        |
        |--- HTTP Request (RESTful API - JWT Auth)
        |
Backend (Node.js + Express)
├── Controller Layer      - Xử lý request & response
├── Service Layer         - Business Logic
├── Model Layer           - ORM SQL thuần (MySQL)
└── Middleware Layer      - JWT Auth, Logger, Error Handler
        |
        |
Database (MySQL)
        └── Lưu trữ toàn bộ dữ liệu
Frontend (Vue.js + Vite)
├── UI/UX riêng biệt
├── Call API Backend qua Axios
├── State quản lý bằng Pinia
└── Responsive, Darkmode, hỗ trợ SEO & SSR
```

---

## 🔐 Phân quyền User

| Role   | Quyền hạn                                                                 |
|--------|---------------------------------------------------------------------------|
| Guest  | Đọc truyện, tìm kiếm                                                      |
| User   | Đăng nhập, bình luận, đánh giá, follow, lưu lịch sử                       |
| Author | Đăng truyện, đăng chương (qua kiểm duyệt), quản lý truyện cá nhân        |
| Admin  | Toàn quyền hệ thống: duyệt truyện, quản lý user/content, cấp quyền, v.v. |

---

## ✨ Chức năng chính

### Người dùng
- Giao diện đọc truyện tối ưu (cuộn dài, dark mode)
- Lưu lịch sử đọc, đánh dấu yêu thích
- Gợi ý truyện liên quan theo hành vi

### Tác giả
- Soạn truyện bằng trình soạn thảo (TinyMCE hoặc Markdown Composer)
- Gửi truyện / chương mới chờ duyệt
- Hỗ trợ chỉnh sửa, trích dẫn và định dạng đẹp

---

## 🤖 Gợi ý truyện thông minh

Cá nhân hóa theo:
- Lịch sử đọc
- Thể loại yêu thích
- Tác giả đã follow
- Nếu thiếu dữ liệu: thêm đề xuất trending / random

---

## 🗂️ Cấu trúc thư mục

```
truyenviethay/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── index.js
│   └── .env, package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/, assets/, components/, layouts/, pages/, router/, stores/
│   │   └── App.vue, main.js
│   └── .env, vite.config.js, package.json
```

---

## 🧮 Database (MySQL)

- Schema: `users`, `stories`, `chapters`, `comments`, `favorites`, `history`, `notifications`, `roles`,...
- Tối ưu index, chuẩn hóa quan hệ
- Hỗ trợ migration, dễ scale đa tác giả & thể loại

---

## 🔌 API Design

- RESTful API (private)
- Endpoint theo chuẩn: `/api/v1/`
- JWT: Access Token & Refresh Token
- Middleware phân quyền, xử lý lỗi rõ ràng
- Sẵn sàng mở rộng tích hợp App Mobile Client

---

## 📈 Định hướng tương lai

- 📱 App Mobile (Flutter / Vue Native)
- 💸 Tích hợp thanh toán / donate (Momo, ZaloPay)
- 🔔 Realtime Notification & Event System
- ⚙️ Chuẩn SEO & SSR cho SEO boost
- 🧱 Scale lên Microservices khi cần thiết

---

## 💡 Coding Convention

- Viết Clean Code, dễ maintain
- Comment hợp lý, không thừa
- Tách biệt rõ Controller / Service / Model
- Thư mục chia theo chức năng

---

## 📄 License

Dự án mã nguồn mở. Vui lòng đọc [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 🤝 Đóng góp

Pull request, issue, góp ý luôn được chào đón.  
Hãy tạo fork, commit, tạo PR và cùng xây dựng một nền tảng đọc truyện Việt mạnh mẽ!

---

## 💬 Liên hệ

> Dev Team - TruyenVietHay  
> 📧 Email: nq20k2@gmail.com *(demo)*  
> 🌐 Website chính thức (sắp ra mắt)