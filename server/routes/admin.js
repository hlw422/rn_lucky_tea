const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const goodsController = require('../controllers/goodsController');
const storeController = require('../controllers/storeController');
const orderController = require('../controllers/orderController');

// 所有管理端路由都需要管理员权限
router.use(adminAuthMiddleware);

// 统计数据
router.get('/stats', adminController.getStats);

// 用户管理
router.get('/users', adminController.getUsers);

// 分类管理
router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// 商品管理
router.get('/goods', goodsController.getGoodsForAdmin);
router.post('/goods', goodsController.createGoods);
router.put('/goods/:id', goodsController.updateGoods);
router.delete('/goods/:id', goodsController.deleteGoods);

// 门店管理
router.get('/stores', storeController.getStoresForAdmin);
router.post('/stores', storeController.createStore);
router.put('/stores/:id', storeController.updateStore);
router.delete('/stores/:id', storeController.deleteStore);

// 订单管理
router.get('/orders', orderController.getOrdersForAdmin);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
