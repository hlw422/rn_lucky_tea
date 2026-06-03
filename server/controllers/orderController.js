const pool = require('../db/pool');

// 生成订单号：LK + 日期 + 4位随机数
function generateOrderNum() {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LK${dateStr}${random}`;
}

// 格式化当前时间
function formatCurrentTime() {
  const now = new Date();
  return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
}

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

// 创建订单
async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { address, goodsName, price } = req.body;

    if (!address || !goodsName || price === undefined) {
      return res.status(400).json({ code: 400, message: '缺少必要参数' });
    }

    const orderNum = generateOrderNum();
    const orderTime = formatCurrentTime();
    const status = 'pending';

    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, order_num, address, goods_name, price, order_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, orderNum, address, goodsName, price, orderTime, status]
    );

    const order = {
      id: result.insertId,
      orderNum,
      address,
      goodsName,
      price: Number(price),
      time: orderTime,
      status,
    };

    res.json({ code: 0, data: order });
  } catch (err) {
    console.error('创建订单失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getOrders, createOrder };
