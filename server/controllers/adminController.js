const pool = require('../db/pool');

// 获取统计数据
async function getStats(req, res) {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [goodsCount] = await pool.execute('SELECT COUNT(*) as count FROM goods');
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [storeCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    const [categoryCount] = await pool.execute('SELECT COUNT(*) as count FROM categories');
    const [couponCount] = await pool.execute('SELECT COUNT(*) as count FROM coupons');

    // 获取订单状态统计
    const [orderStats] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );

    // 获取最近7天的订单数量
    const [recentOrders] = await pool.execute(
      `SELECT DATE(order_time) as date, COUNT(*) as count 
       FROM orders 
       WHERE order_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(order_time)
       ORDER BY date`
    );

    res.json({
      code: 0,
      data: {
        counts: {
          users: userCount[0].count,
          goods: goodsCount[0].count,
          orders: orderCount[0].count,
          stores: storeCount[0].count,
          categories: categoryCount[0].count,
          coupons: couponCount[0].count,
        },
        orderStats,
        recentOrders,
      },
    });
  } catch (err) {
    console.error('获取统计数据失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 获取用户列表
async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.execute(
      'SELECT id, email, name, avatar, role, created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );

    const [total] = await pool.execute('SELECT COUNT(*) as count FROM users');

    res.json({
      code: 0,
      data: {
        list: rows,
        total: total[0].count,
        page,
        pageSize,
      },
    });
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getStats, getUsers };
