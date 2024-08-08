const { matchOrders } = require('../middleware/orderMatching');
const PendingOrder = require('../models/pendingOrder');
const CompletedOrder = require('../models/CompletedOrder');

exports.createOrder = async (req, res) => {
  const { buyerQty, buyerPrice, sellerPrice, sellerQty } = req.body;

  try {
    const completedOrders = await matchOrders(buyerQty, buyerPrice, sellerPrice, sellerQty);
    res.status(200).json({ message: 'Order processed successfully', completedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error });
  }
};

exports.getPendingOrders = async (req, res) => {
  const pendingOrders = await PendingOrder.find();
  res.json(pendingOrders);
};

exports.getCompletedOrders = async (req, res) => {
  const completedOrders = await CompletedOrder.find().sort({ timestamp: -1 });
  res.json(completedOrders);
};
