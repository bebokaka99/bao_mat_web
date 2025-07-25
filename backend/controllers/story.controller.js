// backend/controllers/story.controller.js
const StoryModel = require("../models/story.model");

// Lấy danh sách tất cả truyện
const getAllStories = async (req, res) => {
  try {
    const stories = await StoryModel.getAll();
    res.status(200).json(stories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách truyện" });
  }
};

// Lấy thông tin truyện theo ID
const getStoryById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await StoryModel.getById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("Lỗi khi lấy truyện theo ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy truyện" });
  }
};

// Cập nhật truyện theo ID
const updateStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const data = req.body;

    const existingStory = await StoryModel.getById(storyId);
    if (!existingStory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy truyện để cập nhật" });
    }

    const user = req.user;
    if (user.role !== "admin" && user.id !== existingStory.user_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa truyện này" });
    }

    const affectedRows = await StoryModel.update(storyId, data);
    res.status(200).json({ message: "Cập nhật truyện thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật truyện:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật truyện" });
  }
};

// Xóa truyện
const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const existingStory = await StoryModel.getById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: "Không tìm thấy truyện để xoá" });
    }

    const user = req.user;
    if (user.role !== "admin" && user.id !== existingStory.user_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá truyện này" });
    }

    const affectedRows = await StoryModel.delete(storyId);
    res.status(200).json({ message: "Xoá truyện thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá truyện:", error);
    res.status(500).json({ message: "Lỗi khi xoá truyện" });
  }
};
// Lấy danh sách truyện chờ duyệt
const getPendingApproval = async (req, res) => {
  try {
    const stories = await StoryModel.getPendingApproval();
    res.status(200).json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện chờ duyệt:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy truyện chờ duyệt", error: err.message });
  }
};

// Duyệt hoặc từ chối truyện
const approveOrRejectStory = async (req, res) => {
  const { status, adminNote } = req.body;
  const storyId = req.params.id;

  // Logic validation
  if (!status) {
    return res.status(400).json({ message: "Vui lòng cung cấp trạng thái." });
  }
  if (status === 'tu_choi' && !adminNote) {
    return res.status(400).json({ message: "Vui lòng cung cấp ghi chú khi từ chối truyện." });
  }
  if (!['duyet', 'tu_choi'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ." });
  }

  try {
    const result = await StoryModel.updateApprovalStatus(
      storyId,
      status,
      adminNote || '' 
    );
    
    if (result > 0) {
      res.status(200).json({
        message: `Truyện đã được ${status === "duyet" ? "duyệt" : "từ chối"}`,
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy truyện để cập nhật" });
    }
  } catch (err) {
    console.error("Lỗi khi duyệt / từ chối truyện:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi duyệt / từ chối truyện", error: err.message });
  }
};

// Tác giả xem truyện của chính mình
const getMyStories = async (req, res) => {
  const userId = req.user.id; 

  try {
    const stories = await StoryModel.getByAuthor(userId);

    if (!stories || stories.length === 0) {
      return res.status(200).json({ message: "Bạn chưa đăng truyện nào." });
    }

    res.json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện cá nhân:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin lọc theo tác giả cụ thể
const getStoriesByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "User ID không hợp lệ" });
  }

  try {
    const stories = await StoryModel.getByAuthor(userId);
    if (!stories || stories.length === 0) {
      return res
        .status(200)
        .json({ message: "Người dùng này chưa đăng truyện nào." });
    }
    res.json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện theo user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo truyện mới
const createStory = async (req, res) => {
  try {
    const {
      ten_truyen,
      mo_ta,
      trang_thai,
      tinh_trang,
      trang_thai_viet,
      yeu_to_nhay_cam,
      link_nguon,
      muc_tieu,
      doi_tuong_doc_gia,
      the_loai,
      chuong_mau_tieu_de,
      chuong_mau_noi_dung,
    } = req.body;

    if (!ten_truyen || !mo_ta) {
      return res.status(400).json({ message: "Tên truyện và mô tả không được để trống." });
    }

    const user_id = req.user.id;
    const anh_bia = req.file ? `/uploads_img/bia_truyen/${req.file.filename}` : null;
    const thoi_gian_cap_nhat = new Date();
    const trang_thai_kiem_duyet = "cho_duyet";

    const storyData = {
      ten_truyen,
      tac_gia: req.user.full_name,
      mo_ta,
      trang_thai,
      tinh_trang,
      trang_thai_viet,
      yeu_to_nhay_cam,
      link_nguon,
      muc_tieu,
      doi_tuong_doc_gia,
      thoi_gian_cap_nhat,
      anh_bia,
      trang_thai_kiem_duyet,
      user_id,
      the_loai,
      ghi_chu_admin: null,
      danh_gia_noi_dung: null,
      danh_gia_van_phong: null,
      danh_gia_sang_tao: null,
    };

    const storyId = await StoryModel.create(storyData);

    if (chuong_mau_tieu_de && chuong_mau_noi_dung) {
      const ChapterModel = require("../models/chapter.model");
      try {
        await ChapterModel.createChapter({
          truyen_id: storyId,
          so_chuong: 1,
          tieu_de: chuong_mau_tieu_de,
          noi_dung: chuong_mau_noi_dung,
        });
      } catch (chapterErr) {
        console.error("Lỗi khi tạo chương mẫu, rollback:", chapterErr);
        await StoryModel.delete(storyId);
        return res.status(500).json({ message: "Tạo chương mẫu thất bại, truyện đã bị xóa." });
      }
    }

    res.status(201).json({ message: "Đăng truyện thành công và đang chờ duyệt!", storyId });
  } catch (error) {
    console.error("Lỗi khi tạo truyện:", error);
    res.status(500).json({ message: "Lỗi khi đăng truyện" });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getPendingApproval,
  approveOrRejectStory,
  getStoriesByUserId,
  getMyStories,
  createStory,
};
