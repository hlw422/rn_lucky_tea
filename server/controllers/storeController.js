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

module.exports = { getStores, getStoreById };
