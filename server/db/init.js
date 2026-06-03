const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDatabase() {
  // 先创建不指定数据库的连接（用于建库）
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  });

  const dbName = process.env.DB_NAME || 'luckin_coffee';

  console.log(`正在初始化数据库: ${dbName}`);

  // 创建数据库
  await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.execute(`USE \`${dbName}\``);

  // ========== 建表 ==========

  // 用户表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      avatar VARCHAR(500) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ users 表已创建');

  // 商品分类表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(255) DEFAULT ''
    )
  `);
  console.log('✓ categories 表已创建');

  // 商品表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS goods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(200) NOT NULL,
      characteristic VARCHAR(500) DEFAULT '',
      original_price DECIMAL(10,2) NOT NULL,
      pic VARCHAR(500) DEFAULT '',
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
  console.log('✓ goods 表已创建');

  // 订单表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      order_num VARCHAR(50) NOT NULL,
      address VARCHAR(500) NOT NULL,
      goods_name VARCHAR(200) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      order_time VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('✓ orders 表已创建');

  // 优惠券表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      discount VARCHAR(50) NOT NULL,
      name VARCHAR(200) NOT NULL,
      category VARCHAR(100) DEFAULT '',
      expire_date VARCHAR(50) NOT NULL,
      used TINYINT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('✓ coupons 表已创建');

  // ========== 种子数据 ==========

  // 检查是否已有数据
  const [existingUsers] = await conn.execute('SELECT COUNT(*) as count FROM users');
  if (existingUsers[0].count > 0) {
    console.log('数据库已有数据，跳过种子数据插入');
    await conn.end();
    return;
  }

  // 插入测试用户
  const hashedPassword = await bcrypt.hash('123456', 10);
  await conn.execute(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    ['test@luckin.com', hashedPassword, '测试用户']
  );
  console.log('✓ 测试用户已插入 (test@luckin.com / 123456)');

  // 插入商品分类（与原 mock 数据一致）
  const categories = [
    ['人气TOP', '最受欢迎的饮品'],
    ['大师咖啡', 'WBC冠军大师拼配'],
    ['瑞纳冰', '清凉冰爽系列'],
    ['经典饮品', '经典口味系列'],
    ['健康轻食', '低卡健康选择'],
    ['鲜榨果汁', '新鲜水果现榨'],
  ];
  for (const [name, desc] of categories) {
    await conn.execute('INSERT INTO categories (name, description) VALUES (?, ?)', [name, desc]);
  }
  console.log('✓ 商品分类已插入');

  // 插入商品列表
  const goods = [
    [1, '生椰拿铁', '椰香浓郁，口感丝滑', 29.00, 'https://img.luckincoffee.com/goods/shengye.jpg'],
    [1, '厚乳拿铁', '厚乳香浓，回味悠长', 27.00, 'https://img.luckincoffee.com/goods/hourou.jpg'],
    [1, '陨石拿铁', '黑糖风味，独特体验', 25.00, 'https://img.luckincoffee.com/goods/yunshi.jpg'],
    [2, '美式咖啡', '经典美式，醇香浓厚', 18.00, 'https://img.luckincoffee.com/goods/meishi.jpg'],
    [2, '拿铁', '意式浓缩，丝滑牛奶', 21.00, 'https://img.luckincoffee.com/goods/nati.jpg'],
    [2, '卡布奇诺', '奶泡绵密，口感丰富', 22.00, 'https://img.luckincoffee.com/goods/kabu.jpg'],
    [2, '摩卡', '巧克力风味，香甜浓郁', 24.00, 'https://img.luckincoffee.com/goods/moka.jpg'],
    [3, '冰镇杨梅瑞纳冰', '酸甜杨梅，冰爽解渴', 28.00, 'https://img.luckincoffee.com/goods/yangmei.jpg'],
    [3, '椰子瑞纳冰', '椰香清甜，冰凉畅爽', 26.00, 'https://img.luckincoffee.com/goods/yegzi.jpg'],
    [4, '红茶拿铁', '红茶醇香，奶味浓郁', 19.00, 'https://img.luckincoffee.com/goods/hongcha.jpg'],
    [4, '抹茶拿铁', '日式抹茶，清新淡雅', 22.00, 'https://img.luckincoffee.com/goods/mocha.jpg'],
    [5, '鸡肉帕尼尼', '低脂鸡肉，健康美味', 18.00, 'https://img.luckincoffee.com/goods/jirou.jpg'],
    [5, '牛角面包', '酥脆可口，黄油飘香', 12.00, 'https://img.luckincoffee.com/goods/niujiao.jpg'],
    [6, '鲜榨橙汁', '100%鲜榨，维C满满', 22.00, 'https://img.luckincoffee.com/goods/chengzi.jpg'],
    [6, '鲜榨西瓜汁', '夏日解暑，清甜可口', 18.00, 'https://img.luckincoffee.com/goods/xigua.jpg'],
  ];
  for (const [categoryId, name, characteristic, originalPrice, pic] of goods) {
    await conn.execute(
      'INSERT INTO goods (category_id, name, characteristic, original_price, pic) VALUES (?, ?, ?, ?, ?)',
      [categoryId, name, characteristic, originalPrice, pic]
    );
  }
  console.log('✓ 商品列表已插入');

  // 为测试用户插入订单数据
  const orders = [
    [1, 'LK20240601001', '北京市朝阳区建国路88号SOHO现代城', '生椰拿铁 x1', 29.00, '2024-06-01 10:30', 'completed'],
    [1, 'LK20240601002', '上海市浦东新区陆家嘴环路1000号', '厚乳拿铁 x2', 54.00, '2024-06-01 14:20', 'pending'],
    [1, 'LK20240531003', '深圳市南山区科技园南路', '美式咖啡 x1, 拿铁 x1', 39.00, '2024-05-31 09:15', 'completed'],
  ];
  for (const [userId, orderNum, address, goodsName, price, time, status] of orders) {
    await conn.execute(
      'INSERT INTO orders (user_id, order_num, address, goods_name, price, order_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, orderNum, address, goodsName, price, time, status]
    );
  }
  console.log('✓ 订单数据已插入');

  // 为测试用户插入优惠券数据
  const coupons = [
    [1, '3.8折', '新品尝鲜券', '全场通用', '2024-12-31', 0],
    [1, '5元', '满30减5', '大师咖啡', '2024-08-31', 0],
    [1, '8折', '周末特惠券', '瑞纳冰', '2024-07-31', 1],
    [1, '免运费', '免配送费券', '全场通用', '2024-09-30', 0],
  ];
  for (const [userId, discount, name, category, expireDate, used] of coupons) {
    await conn.execute(
      'INSERT INTO coupons (user_id, discount, name, category, expire_date, used) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, discount, name, category, expireDate, used]
    );
  }
  console.log('✓ 优惠券数据已插入');

  console.log('\n数据库初始化完成！');
  await conn.end();
}

// 如果直接运行此文件则执行初始化
if (require.main === module) {
  initDatabase().catch(err => {
    console.error('数据库初始化失败:', err);
    process.exit(1);
  });
}

module.exports = { initDatabase };
