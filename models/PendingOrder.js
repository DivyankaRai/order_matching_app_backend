const mongoose = require('mongoose');

const pendingOrderSchema = new mongoose.Schema({
  buyerQty: Number,
  buyerPrice: Number,
  sellerPrice: Number,
  sellerQty: Number
});

module.exports = mongoose.model('PendingOrder', pendingOrderSchema);

