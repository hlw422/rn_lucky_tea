# 瑞幸咖啡后端服务

基于 Node.js + Express + MySQL 的后端 API 服务。

## 环境要求

- Node.js 18+
- MySQL 5.7+ 或 8.0+

## 安装

```bash
cd server
npm install
```

## 配置

编辑 `.env` 文件，配置 MySQL 连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=luckin_coffee

JWT_SECRET=your_secret_key
PORT=3000
```

## 初始化数据库

确保 MySQL 服务已启动，然后运行：

```bash
npm run init-db
```

这将自动创建数据库、表结构和初始测试数据。

## 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务将在 http://localhost:3000 启动。

## API 接口

### 公开接口（无需认证）

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/register | 用户注册 |
| POST | /api/login | 用户登录 |
| GET | /api/categories | 获取商品分类 |
| GET | /api/goods | 获取商品列表 |

### 需要认证的接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/orders | 获取订单列表 |
| GET | /api/coupons | 获取优惠券列表 |

### 认证方式

在请求头中添加：
```
Authorization: Bearer <token>
```

### 测试账号

- 邮箱: test@luckin.com
- 密码: 123456

## 响应格式

```json
{
  "code": 0,
  "data": { ... }
}
```

错误响应：
```json
{
  "code": 400,
  "message": "错误信息"
}
```
