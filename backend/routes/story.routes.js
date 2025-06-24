const express = require("express");
const router = express.Router();
const storyController = require("../controllers/story.controller");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const uploadStoryCover = require("../middleware/upload_story");

// Lấy tất cả truyện (Public)
router.get("/", storyController.getAllStories);

// Tác giả xem truyện của mình (Author, Admin)
router.get(
  "/truyen-cua-toi",
  authenticateToken,
  authorizeRoles("author", "admin"),
  storyController.getMyStories
);

// Lấy danh sách truyện chờ duyệt (Admin)
router.get(
  "/cho-duyet",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.getPendingApproval
);

// Admin xem truyện theo userId (Admin)
router.get(
  "/theo-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.getStoriesByUserId
);

// Lấy truyện theo ID (Public)
// *Lưu ý: Route này phải nằm sau các route tĩnh khác để tránh xung đột*
router.get("/:id", storyController.getStoryById);

// Tạo truyện mới (Author, Admin)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "author"),
  uploadStoryCover.single("anh_bia"),
  storyController.createStory
);

// Cập nhật truyện (Author, Admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  storyController.updateStory
);

// Duyệt hoặc từ chối truyện (Admin)
router.put(
  "/:id/duyet-or-tu_choi",
  authenticateToken,
  authorizeRoles("admin"),
  storyController.approveOrRejectStory
);

// Xoá truyện (Author, Admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  storyController.deleteStory
);

module.exports = router;