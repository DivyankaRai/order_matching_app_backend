const express = require('express');
const {
  createOrder,
  getPendingOrders,
  getCompletedOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders', getPendingOrders);
router.get('/completed-orders', getCompletedOrders);

module.exports = router;
