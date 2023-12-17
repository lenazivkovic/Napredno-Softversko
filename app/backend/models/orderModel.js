//Gotov
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    code: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, }, //dodaj required
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paidAt: {
      type: Date,
    },
    confirmed: {
      type: String,
      required: true,
      default: false,
    },
    stores: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: 'Store',
    },
  },
  {
    timeStamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
