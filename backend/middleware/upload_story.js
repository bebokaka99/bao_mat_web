const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads_img/bia_truyen");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = "truyen_" + Date.now() + ext;
    cb(null, name);
  },
});

// Giới hạn và lọc loại file
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Chỉ chấp nhận ảnh JPG, PNG hoặc WebP"));
  },
});

module.exports = upload;
