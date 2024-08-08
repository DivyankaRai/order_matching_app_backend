const mongoose = require('mongoose');
const PendingOrder = require('../models/pendingOrder');
const CompletedOrder = require('../models/CompletedOrder');

const matchOrders = async (buyerQty, buyerPrice, sellerPrice, sellerQty) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const pendingOrder = await PendingOrder.findOne({
      sellerPrice: buyerPrice
    }).session(session);

    const completedOrders = [];

    if (pendingOrder) {
      const matchQty = Math.min(buyerQty, pendingOrder.sellerQty);

      completedOrders.push({ price: buyerPrice, qty: matchQty });

      if (buyerQty > pendingOrder.sellerQty) {
        await PendingOrder.updateOne(
          { _id: pendingOrder._id },
          { $set: { buyerQty: buyerQty - pendingOrder.sellerQty } },
          { session }
        );
        await PendingOrder.updateOne(
          { _id: pendingOrder._id },
          { $unset: { sellerQty: '' } },
          { session }
        );
      } else if (pendingOrder.sellerQty > buyerQty) {
        await PendingOrder.updateOne(
          { _id: pendingOrder._id },
          { $set: { sellerQty: pendingOrder.sellerQty - buyerQty } },
          { session }
        );
      } else {
        await PendingOrder.deleteOne({ _id: pendingOrder._id }, { session });
      }
    } else {
      await PendingOrder.create([{ buyerQty, buyerPrice, sellerPrice, sellerQty }], { session });
    }

    if (completedOrders.length > 0) {
      await CompletedOrder.insertMany(completedOrders, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return completedOrders;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { matchOrders };
