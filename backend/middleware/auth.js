const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    console.log('Authenticate user data:', { id: user.id, username: user.username, status: user.status, ban_until: user.ban_until }); // Debug

    // Kiểm tra trạng thái tài khoản
    if (user.status === 'blocked' || user.status === '') {
      if (user.ban_until && new Date(user.ban_until) > new Date()) {
        return res.status(403).json({
          message: `Tài khoản bị khóa đến ${new Date(user.ban_until).toLocaleString('vi-VN')}`,
        });
      } else if (!user.ban_until) {
        return res.status(403).json({ message: 'Tài khoản bị khóa vĩnh viễn' });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in authenticateToken:', err);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };