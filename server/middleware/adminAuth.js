const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'luckin_coffee_secret_key_2024';

function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // 验证是否为管理员角色
    if (decoded.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '权限不足，需要管理员权限' });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: '令牌无效或已过期' });
  }
}

module.exports = adminAuthMiddleware;
