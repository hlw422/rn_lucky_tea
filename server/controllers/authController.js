const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'luckin_coffee_secret_key_2024';

// 注册
async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ code: 400, message: '邮箱、密码和姓名不能为空' });
    }

    // 检查邮箱是否已注册
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ code: 400, message: '该邮箱已注册' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    const user = { id: result.insertId, email, name, role: 'user' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({ code: 0, data: { token, user } });
  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 登录
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ code: 400, message: '邮箱和密码不能为空' });
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    const tokenUser = { id: user.id, email: user.email, name: user.name, role: user.role || 'user' };
    const token = jwt.sign(tokenUser, JWT_SECRET, { expiresIn: '7d' });

    res.json({ code: 0, data: { token, user: tokenUser } });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

module.exports = { register, login };
