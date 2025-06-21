const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_theloai, ten_theloai FROM theloai_new');
    res.json(rows);
  } catch (err) {
    console.error('Lỗi khi lấy thể loại:', err);
    res.status(500).json({ message: 'Không thể lấy thể loại' });
  }
});

module.exports = router;
