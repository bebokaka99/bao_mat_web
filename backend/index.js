// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Xử lý preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Debug request
app.use((req, res, next) => {
  console.log(`Received: ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require("./routes/auth.routes");
const storyRoutes = require("./routes/story.routes");
const chapterRoutes = require("./routes/chapter.routes");
const uploadRoutes = require("./routes/upload.routes");
const fileRoutes = require("./routes/file.routes");
const userRoutes = require('./routes/user.routes');
const genreRoutes = require("./routes/genre.routes");

app.use("/api/auth", authRoutes);
// === DÒNG CODE ĐƯỢC SỬA LẠI NẰM Ở ĐÂY ===
app.use("/api/v1/story", storyRoutes);
// ======================================
app.use("/api/chuong", chapterRoutes);
app.use("/api/upload-truyen", uploadRoutes);
app.use("/api/upload-files", fileRoutes);
app.use('/api/v1', userRoutes);
app.use("/api/v1/genres", genreRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Middleware xử lý 404
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Tuyến đường không tồn tại" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});