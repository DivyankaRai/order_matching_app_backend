const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for buyer orders
router.post('/buyer-order', orderController.createBuyerOrder);
router.get('/pending-buyer-orders', orderController.getPendingBuyerOrders);

// Routes for seller orders
router.post('/seller-order', orderController.createSellerOrder);
router.get('/pending-seller-orders', orderController.getPendingSellerOrders);

// Route for completed orders
router.get('/completed-orders', orderController.getCompletedOrders);

module.exports = router;

