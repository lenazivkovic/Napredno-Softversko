const express = require('express');

const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');
const commentRouter = require('./commentRoutes');

const router = express.Router();
router.route('/categories').get(storeController.getStoreCategories);

router.use('/:storeId/comments', commentRouter); //prosledjujemo u comment router
router
  .route('/categoriesAndSubcategories/:id')
  .get(storeController.categoriesAndSubcategoriesFromOneStore);
router
  .route('/:id/reviews')
  .patch(authController.protect, storeController.newReview);
router
  .route('/stores-within/:distance/center/:latlng/unit/:unit')
  .get(storeController.getStoresWithin);
//npr: /stores-within/233/center/-40,45/unit/km
router.route('/findStores').get(storeController.findStores);
router
  .route('/:id')
  .get(storeController.getStoreByID)
  //.get(storeController.getStoresProductsTroughID)
  .patch(
    authController.protect,
    authController.restrictTo('lead-admin store-admin'),
    imageController.addLogoImage,
    imageController.resizeImage1000x1000,
    storeController.updateStore
  )
  .delete(
    authController.protect,
    authController.restrictTo('lead-admin'),
    storeController.deleteStore
  );

router
  .route('/delete-order/:orderId')
  .patch(
    authController.protect,
    authController.restrictTo('store-admin'),
    storeController.deleteFromOrderHistory
  );
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('lead-admin'),
    imageController.addLogoImage,
    imageController.resizeImage1000x1000,
    storeController.createStore
  )
  .get(storeController.getAllStores);

module.exports = router;
