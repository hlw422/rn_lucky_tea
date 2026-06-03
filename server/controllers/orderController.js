const pool = require('../db/pool');

// 获取订单列表
async function getOrders(req, res) {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    let rows;
    if (status) {
      [rows] = await pool.execute(
        'SELECT id, order_num as orderNum, address, goods_name as goodsName, price, order_time as time, status FROM orders WHERE user_id = ? AND status = ? ORDER BY id DESC',
        [userId, status]
      );
    } else {
      [rows] = await pool.execute(
        'SELECT id, order_num as orderNum, address, goods_name as goodsName, price, order_time as time, status FROM orders WHERE user_id = ? ORDER BY id DESC',
        [userId]
      );
    }
    res.json({ code: 0, data: rows });
  } catch (err) {
    console.error('获取订单失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getOrders };
