const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/authController');
const goodsController = require('../controllers/goodsController');
const orderController = require('../controllers/orderController');
const couponController = require('../controllers/couponController');

// 公开接口（无需认证）
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/categories', goodsController.getCategories);
router.get('/goods', goodsController.getGoods);

// 需要认证的接口
router.get('/orders', authMiddleware, orderController.getOrders);
router.get('/coupons', authMiddleware, couponController.getCoupons);

module.exports = router;
