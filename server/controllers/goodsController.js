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

// 管理端：获取商品列表（支持分页和分类筛选）
async function getGoodsForAdmin(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const categoryId = req.query.categoryId;
    const offset = (page - 1) * pageSize;

    let whereClause = '';
    let params = [];

    if (categoryId) {
      whereClause = 'WHERE g.category_id = ?';
      params.push(categoryId);
    }

    const [rows] = await pool.execute(
      `SELECT g.id, g.category_id as categoryId, c.name as categoryName, g.name, g.characteristic, g.original_price as originalPrice, g.pic 
       FROM goods g 
       LEFT JOIN categories c ON g.category_id = c.id 
       ${whereClause}
       ORDER BY g.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const [total] = await pool.execute(
      `SELECT COUNT(*) as count FROM goods g ${whereClause}`,
      params
    );

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
    console.error('获取商品列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：新增商品
async function createGoods(req, res) {
  try {
    const { categoryId, name, characteristic, originalPrice, pic } = req.body;
    if (!categoryId || !name || !originalPrice) {
      return res.status(400).json({ code: 400, message: '分类、名称和价格不能为空' });
    }

    const [result] = await pool.execute(
      'INSERT INTO goods (category_id, name, characteristic, original_price, pic) VALUES (?, ?, ?, ?, ?)',
      [categoryId, name, characteristic || '', originalPrice, pic || '']
    );

    res.json({
      code: 0,
      data: { id: result.insertId, categoryId, name, characteristic, originalPrice, pic },
    });
  } catch (err) {
    console.error('新增商品失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：更新商品
async function updateGoods(req, res) {
  try {
    const { id } = req.params;
    const { categoryId, name, characteristic, originalPrice, pic } = req.body;

    if (!categoryId || !name || !originalPrice) {
      return res.status(400).json({ code: 400, message: '分类、名称和价格不能为空' });
    }

    await pool.execute(
      'UPDATE goods SET category_id = ?, name = ?, characteristic = ?, original_price = ?, pic = ? WHERE id = ?',
      [categoryId, name, characteristic || '', originalPrice, pic || '', id]
    );

    res.json({ code: 0, message: '更新成功' });
  } catch (err) {
    console.error('更新商品失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：删除商品
async function deleteGoods(req, res) {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM goods WHERE id = ?', [id]);
    res.json({ code: 0, message: '删除成功' });
  } catch (err) {
    console.error('删除商品失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getCategories, getGoods, getGoodsForAdmin, createGoods, updateGoods, deleteGoods };
