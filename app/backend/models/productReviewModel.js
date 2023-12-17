//da vidimo prvo sta cemo

const mongoose = require('mongoose');

const productReviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Must provide a review'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },

    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  {
    timeStamps: true,
  }
);

commentScheema.pre(/^find/, function (next) {
  //svaki put kad identifikujes find pokreni fju
  this.populate({
    path: 'product',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const ProductReview = mongoose.model('ProductReview', productReviewSchema);

module.exports = ProductReview;
