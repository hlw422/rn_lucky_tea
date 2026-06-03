const pool = require('../db/pool');

// 获取优惠券列表
async function getCoupons(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(
      'SELECT id, discount, name, category, expire_date as expireDate, used FROM coupons WHERE user_id = ? ORDER BY id',
      [userId]
    );
    res.json({ code: 0, data: rows });
  } catch (err) {
    console.error('获取优惠券失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getCoupons };
