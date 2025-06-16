const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
  const {
    username,
    password,
    email,
    full_name,
    phone,
    role = 'user',
    avatar,
    gender = 'other',
  } = req.body;

  if (!username || !password || !email || !full_name || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      email,
      full_name,
      phone,
      role,
      avatar: avatar || '/uploads_img/avatar/default-avatar.jpg',
      gender,
    };

    await User.create(newUser);
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo user', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await User.findByUsername(username);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const user = results[0];
    console.log('Login user data:', { id: user.id, username: user.username, status: user.status, ban_until: user.ban_until }); // Debug

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

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
  }
};

// Lấy thông tin người dùng
exports.getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const results = await User.findById(userId);
    console.log('Database query results:', results); // Debug
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const user = results[0];
    console.log('Queried user:', user); // Debug
    res.json({
      message: 'Thông tin người dùng',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        gender: user.gender,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error in getMe:', err.message); // Debug
    res.status(500).json({
      message: 'Lỗi khi lấy thông tin người dùng',
      error: err.message,
    });
  }
};

// Cập nhật thông tin người dùng
exports.updateMe = async (req, res) => {
  const userId = req.user.id;
  console.log('Received FormData:', req.body, req.files); // Debug

  const { full_name, email, phone, gender } = req.body;
  let avatarPath = null;

  if (req.files && req.files.avatar) {
    avatarPath = '/uploads_img/avatar/' + req.files.avatar[0].filename;
  }

  try {
    const updateData = {
      full_name: full_name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      gender: gender || undefined,
      avatar: avatarPath || undefined,
    };

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const affected = await User.updateUser(userId, updateData);

    if (affected === 0) {
      return res
        .status(400)
        .json({ message: 'Không có thông tin nào được cập nhật.' });
    }

    const updatedUser = await User.findById(userId);
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      message: 'Cập nhật thông tin thành công!',
      user: updatedUser[0],
    });
  } catch (err) {
    console.error('UpdateMe error:', err.message);
    res.status(500).json({
      message: 'Lỗi khi cập nhật thông tin',
      error: err.message,
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res
      .status(400)
      .json({ message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
  }

  try {
    const results = await User.findById(userId);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const user = results[0];
    const match = await bcrypt.compare(current_password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    await User.updatePassword(userId, new_password);
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi đổi mật khẩu',
      error: err.message,
    });
  }
};