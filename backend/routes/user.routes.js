// backend/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');

// Route lấy danh sách người dùng (chỉ admin)
router.get('/users', authenticateToken, authorizeRoles('admin'), userController.getUsers);

// Route khóa người dùng
router.patch('/users/:id/lock', authenticateToken, authorizeRoles('admin'), userController.lockUser);

// Route mở khóa người dùng
router.patch('/users/:id/unlock', authenticateToken, authorizeRoles('admin'), userController.unlockUser);

// Route cập nhật quyền
router.patch('/users/:id/role', authenticateToken, authorizeRoles('admin'), userController.updateRole);

module.exports = router;