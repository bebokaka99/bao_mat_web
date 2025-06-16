// backend/controllers/user.controller.js
const UserModel = require('../models/user.model');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { users, total } = await UserModel.findAll(page, limit);
    console.log('getUsers response:', { users, total, page, limit }); // Debug
    res.json({
      message: 'Lấy danh sách người dùng thành công',
      data: { users, total, page, limit },
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
  }
};

exports.lockUser = async (req, res) => {
  const { id } = req.params;
  const { ban_until } = req.body;
  try {
    const affected = await UserModel.lockUser(id, ban_until || null);
    if (affected === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Khóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi khóa người dùng', error: err.message });
  }
};

exports.unlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const affected = await UserModel.unlockUser(id);
    if (affected === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Mở khóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi mở khóa người dùng', error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const affected = await UserModel.updateRole(id, role);
    if (affected === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Cập nhật quyền thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật quyền', error: err.message });
  }
};