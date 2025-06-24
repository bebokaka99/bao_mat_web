const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  create: async (user) => {
    const [result] = await db.query(
      'INSERT INTO users_new (username, password, email, full_name, phone, role, avatar, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user.username,
        user.password,
        user.email,
        user.full_name,
        user.phone,
        user.role,
        user.avatar,
        user.gender,
      ]
    );
    return result;
  },

  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users_new WHERE username = ?', [username]);
    console.log('findByUsername result:', rows); // Debug
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users_new WHERE id = ?', [id]);
    return rows;
  },

  findAll: async (page = 1, limit = 20) => {
    try {
      const offset = (page - 1) * limit;
      const [users] = await db.query(
        'SELECT id, username, email, role, status, ban_until FROM users_new ORDER BY id ASC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      const [countResult] = await db.query('SELECT COUNT(*) as total FROM users_new');
      console.log('findAll result:', { users, total: countResult[0].total }); // Debug
      return { users, total: countResult[0].total };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    const [result] = await db.query(
      `UPDATE users_new SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query(
      'UPDATE users_new SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows;
  },

  lockUser: async (id, banUntil = null) => {
    console.log('lockUser query:', { id, status: 'blocked', banUntil });
    const [result] = await db.query(
      'UPDATE users_new SET status = ?, ban_until = ? WHERE id = ?',
      ['blocked', banUntil, id]
    );
    console.log('lockUser result:', result); 
    return result.affectedRows;
  },

  unlockUser: async (id) => {
    console.log('unlockUser query:', { id, status: 'active' });
    const [result] = await db.query(
      'UPDATE users_new SET status = ?, ban_until = ? WHERE id = ?',
      ['active', null, id]
    );
    console.log('unlockUser result:', result); 
    return result.affectedRows;
  },

  updateRole: async (id, role) => {
    const [result] = await db.query(
      'UPDATE users_new SET role = ? WHERE id = ?',
      [role, id]
    );
    return result.affectedRows;
  },
};

module.exports = UserModel;