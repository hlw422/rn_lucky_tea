const pool = require('../db/pool');

// 获取商品分类列表
async function getCategories(req, res) {
  try {
    const [rows] = await pool.execute('SELECT id, name, description as `desc` FROM categories ORDER BY id');
    res.json({ code: 0, data: rows });
  } catch (err) {
    console.error('获取分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 获取商品列表（支持按分类筛选）
async function getGoods(req, res) {
  try {
    const { categoryId } = req.query;
    let rows;
    if (categoryId) {
      [rows] = await pool.execute(
        'SELECT id, category_id as categoryId, name, characteristic, original_price as originalPrice, pic FROM goods WHERE category_id = ?',
        [categoryId]
      );
    } else {
      [rows] = await pool.execute(
        'SELECT id, category_id as categoryId, name, characteristic, original_price as originalPrice, pic FROM goods'
      );
    }
    res.json({ code: 0, data: rows });
  } catch (err) {
    console.error('获取商品失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getCategories, getGoods };
