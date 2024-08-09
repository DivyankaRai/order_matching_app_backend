const mongoose = require('mongoose');

const sellerOrderSchema = new mongoose.Schema({
  sellerQty: { type: Number, required: true },
  sellerPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SellerOrder', sellerOrderSchema);

