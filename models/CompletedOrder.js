const mongoose = require('mongoose');

const completedOrderSchema = new mongoose.Schema({
  price: Number,
  qty: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompletedOrder', completedOrderSchema);