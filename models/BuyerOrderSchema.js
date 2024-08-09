const mongoose = require('mongoose');

const buyerOrderSchema = new mongoose.Schema({
  buyerQty: { type: Number, required: true },
  buyerPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BuyerOrder', buyerOrderSchema);
