const mongoose = require('mongoose');
const BuyerOrder = require('../models/BuyerOrderSchema');
const SellerOrder = require('../models/SellerOrderSchema');
const CompletedOrder = require('../models/CompletedOrder');
const { matchOrders } = require('../middleware/orderMatching');

// Create a buyer order
exports.createBuyerOrder = async (req, res) => {
  const { buyerQty, buyerPrice } = req.body;

  try {
    const completedOrders = await matchOrders(buyerQty, buyerPrice, null, null);
    res.status(200).json({ message: 'Buyer order processed successfully', completedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Error processing buyer order', error });
  }
};

// Create a seller order
exports.createSellerOrder = async (req, res) => {
  const { sellerQty, sellerPrice } = req.body;

  try {
    const completedOrders = await matchOrders(null, null, sellerPrice, sellerQty);
    res.status(200).json({ message: 'Seller order processed successfully', completedOrders });
  } catch (error) {
    res.status(500).json({ message: 'Error processing seller order', error });
  }
};

// Get all pending buyer orders
exports.getPendingBuyerOrders = async (req, res) => {
  try {
    const pendingBuyerOrders = await BuyerOrder.find();
    console.log(pendingBuyerOrders)
    res.status(200).json(pendingBuyerOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending buyer orders', error });
  }
};

// Get all pending seller orders
exports.getPendingSellerOrders = async (req, res) => {
  try {
    const pendingSellerOrders = await SellerOrder.find();
    console.log(pendingSellerOrders)
    res.status(200).json(pendingSellerOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending seller orders', error });
  }
};

// Get all completed orders
exports.getCompletedOrders = async (req, res) => {
  try {
    const completedOrders = await CompletedOrder.find().sort({ timestamp: -1 });
    res.status(200).json(completedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving completed orders', error });
  }
};
