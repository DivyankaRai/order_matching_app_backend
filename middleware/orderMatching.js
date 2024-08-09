const mongoose = require('mongoose');
const BuyerOrder = require('../models/BuyerOrderSchema');
const SellerOrder = require('../models/SellerOrderSchema');
const CompletedOrder = require('../models/CompletedOrder');

const matchOrders = async (buyerQty, buyerPrice, sellerPrice, sellerQty) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const completedOrders = [];
    let remainingBuyerQty = buyerQty || 0;
    let remainingSellerQty = sellerQty || 0;

    // Handle buyer order
    if (buyerPrice !== null) {
      const matchingSellerOrder = await SellerOrder.findOne({
        sellerPrice: buyerPrice,
        sellerQty: { $gt: 0 }
      }).session(session);

      if (matchingSellerOrder) {
        const matchQty = Math.min(remainingBuyerQty, matchingSellerOrder.sellerQty);
        completedOrders.push({ price: buyerPrice, qty: matchQty });

        if (remainingBuyerQty > matchingSellerOrder.sellerQty) {
          remainingBuyerQty -= matchingSellerOrder.sellerQty;

          matchingSellerOrder.sellerQty -= matchQty;
          if (matchingSellerOrder.sellerQty > 0) {
            await matchingSellerOrder.save({ session });
          } else {
            await matchingSellerOrder.deleteOne({ session });
          }

          if (remainingBuyerQty > 0) {
            const newBuyerOrder = new BuyerOrder({
              buyerQty: remainingBuyerQty,
              buyerPrice: buyerPrice
            });
            await newBuyerOrder.save({ session });
          }
        } else {
          matchingSellerOrder.sellerQty -= remainingBuyerQty;
          if (matchingSellerOrder.sellerQty > 0) {
            await matchingSellerOrder.save({ session });
          } else {
            await matchingSellerOrder.deleteOne({ session });
          }
          remainingBuyerQty = 0;
        }
      } else if (remainingBuyerQty > 0) {
        const newBuyerOrder = new BuyerOrder({
          buyerQty: remainingBuyerQty,
          buyerPrice: buyerPrice
        });
        await newBuyerOrder.save({ session });
        remainingBuyerQty = 0;
      }
    }

    // Handle seller order
    if (sellerPrice !== null) {
      const matchingBuyerOrder = await BuyerOrder.findOne({
        buyerPrice: sellerPrice,
        buyerQty: { $gt: 0 }
      }).session(session);

      if (matchingBuyerOrder) {
        const matchQty = Math.min(remainingSellerQty, matchingBuyerOrder.buyerQty);
        completedOrders.push({ price: sellerPrice, qty: matchQty });

        if (remainingSellerQty > matchingBuyerOrder.buyerQty) {
          remainingSellerQty -= matchingBuyerOrder.buyerQty;

          matchingBuyerOrder.buyerQty -= matchQty;
          if (matchingBuyerOrder.buyerQty > 0) {
            await matchingBuyerOrder.save({ session });
          } else {
            await matchingBuyerOrder.deleteOne({ session });
          }

          if (remainingSellerQty > 0) {
            const newSellerOrder = new SellerOrder({
              sellerQty: remainingSellerQty,
              sellerPrice: sellerPrice
            });
            await newSellerOrder.save({ session });
          }
        } else {
          matchingBuyerOrder.buyerQty -= remainingSellerQty;
          if (matchingBuyerOrder.buyerQty > 0) {
            await matchingBuyerOrder.save({ session });
          } else {
            await matchingBuyerOrder.deleteOne({ session });
          }
          remainingSellerQty = 0;
        }
      } else if (remainingSellerQty > 0) {
        const newSellerOrder = new SellerOrder({
          sellerQty: remainingSellerQty,
          sellerPrice: sellerPrice
        });
        const data = await newSellerOrder.save({ session });
        console.log(data)
        remainingSellerQty = 0;

      }
    }

    // Insert completed orders
    if (completedOrders.length > 0) {
      await CompletedOrder.insertMany(completedOrders, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return completedOrders;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction error:', error);
    throw error;
  }
};

module.exports = { matchOrders };
