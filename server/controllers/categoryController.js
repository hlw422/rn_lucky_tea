const pool = require('../db/pool');

// 获取分类列表
async function getCategories(req, res) {
  try {
    const [rows] = await pool.execute('SELECT id, name, description FROM categories ORDER BY id');
    res.json({ code: 0, data: rows });
  } catch (err) {
    console.error('获取分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 新增分类
async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空' });
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    res.json({ code: 0, data: { id: result.insertId, name, description: description || '' } });
  } catch (err) {
    console.error('新增分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 更新分类
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空' });
    }

    await pool.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );

    res.json({ code: 0, message: '更新成功' });
  } catch (err) {
    console.error('更新分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 删除分类
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    
    // 检查是否有关联商品
    const [goods] = await pool.execute('SELECT COUNT(*) as count FROM goods WHERE category_id = ?', [id]);
    if (goods[0].count > 0) {
      return res.status(400).json({ code: 400, message: '该分类下还有商品，无法删除' });
    }

    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ code: 0, message: '删除成功' });
  } catch (err) {
    console.error('删除分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
