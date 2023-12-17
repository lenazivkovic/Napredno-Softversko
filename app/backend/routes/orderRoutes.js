const express = require('express');

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get(
  '/summary',
  authController.protect,
  authController.restrictTo('lead-admin'),
  orderController.getSummary
);

router.get(
  '/store-summary',
  authController.protect,
  authController.restrictTo('store-admin'),
  orderController.getStoreSummary
);

router.post(
  '/checkout-session/',
  authController.protect,
  orderController.createCheckoutSession
);
router.delete(
  '/canceled-order/:id',
  authController.protect,
  orderController.returnItemsInStock
);

router
  .route('/customer-pickup/:code')
  .patch(
    authController.protect,
    authController.restrictTo('store-admin'),
    orderController.customerPickUp
  );

router
  .route('/one-store/:id')
  .get(
    authController.protect,
    authController.restrictTo('store-admin'),
    orderController.getProductsFromOneStore
  );
// router.patch(
//   '/customer-pickup/:code',
//   authController.protect,
//   authController.restrictTo('store-admin'),
//   orderController.customerPickUp
// );

router.patch(
  '/confirm-order/:id',
  authController.protect,
  orderController.confirmOrder
);

router.route('/oneOrder/:id').get(orderController.getOrder);

router
  .route('/searchOrder')
  .get(
    authController.protect,
    authController.restrictTo('store-admin'),
    orderController.searchOrder
  );

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('store-admin'),
    orderController.getStoreOrderHistory
  );

//router.route('/').post(authController.protect, orderController.addOrder);

module.exports = router;
