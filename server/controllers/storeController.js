const pool = require('../db/pool');

// Haversine 公式计算两点距离（米）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 格式化距离
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// 获取门店列表（支持按距离排序）
async function getStores(req, res) {
  try {
    const { latitude, longitude } = req.query;
    
    const [rows] = await pool.execute(
      'SELECT id, name, address, latitude, longitude, business_hours as businessHours, phone FROM stores'
    );
    
    // 如果提供了用户位置，计算距离并排序
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      
      const storesWithDistance = rows.map(store => {
        const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);
        return {
          ...store,
          distance: Math.round(distance),
          distanceText: formatDistance(distance),
        };
      });
      
      // 按距离排序
      storesWithDistance.sort((a, b) => a.distance - b.distance);
      
      res.json({ code: 0, data: storesWithDistance });
    } else {
      res.json({ code: 0, data: rows });
    }
  } catch (err) {
    console.error('获取门店失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 获取单个门店详情
async function getStoreById(req, res) {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.query;
    
    const [rows] = await pool.execute(
      'SELECT id, name, address, latitude, longitude, business_hours as businessHours, phone FROM stores WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: '门店不存在' });
    }
    
    const store = rows[0];
    
    // 如果提供了用户位置，计算距离
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);
      store.distance = Math.round(distance);
      store.distanceText = formatDistance(distance);
    }
    
    res.json({ code: 0, data: store });
  } catch (err) {
    console.error('获取门店详情失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：获取门店列表（支持分页）
async function getStoresForAdmin(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query(
      `SELECT id, name, address, latitude, longitude, business_hours as businessHours, phone, created_at FROM stores ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`
    );

    const [total] = await pool.query('SELECT COUNT(*) as count FROM stores');

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
    console.error('获取门店列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：新增门店
async function createStore(req, res) {
  try {
    const { name, address, latitude, longitude, businessHours, phone } = req.body;
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ code: 400, message: '门店名称、地址和坐标不能为空' });
    }

    const [result] = await pool.execute(
      'INSERT INTO stores (name, address, latitude, longitude, business_hours, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [name, address, latitude, longitude, businessHours || '07:00-22:00', phone || '']
    );

    res.json({
      code: 0,
      data: { id: result.insertId, name, address, latitude, longitude, businessHours, phone },
    });
  } catch (err) {
    console.error('新增门店失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：更新门店
async function updateStore(req, res) {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, businessHours, phone } = req.body;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ code: 400, message: '门店名称、地址和坐标不能为空' });
    }

    await pool.execute(
      'UPDATE stores SET name = ?, address = ?, latitude = ?, longitude = ?, business_hours = ?, phone = ? WHERE id = ?',
      [name, address, latitude, longitude, businessHours || '07:00-22:00', phone || '', id]
    );

    res.json({ code: 0, message: '更新成功' });
  } catch (err) {
    console.error('更新门店失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 管理端：删除门店
async function deleteStore(req, res) {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM stores WHERE id = ?', [id]);
    res.json({ code: 0, message: '删除成功' });
  } catch (err) {
    console.error('删除门店失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { getStores, getStoreById, getStoresForAdmin, createStore, updateStore, deleteStore };
