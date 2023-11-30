const express = require('express');

const usersController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/orderHistory')
  .get(authController.protect, usersController.getUserOrderHistory);

router
  .route('/searchUsers')
  .get(
    authController.protect,
    authController.restrictTo('lead-admin'),
    usersController.findUsersByMail
  );
router
 .route('/lastViewed')
 .get(authController.protect, usersController.getUserLastViewed);
 
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('lead-admin'),
    usersController.adminUpdateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('lead-admin'),
    usersController.userDeleteByAdmin
  )
  .get(
    authController.protect,
    authController.restrictTo('lead-admin'),
    usersController.getUserByID
  );
router
  .route('/')
  .delete(authController.protect, usersController.deleteUser)
  .patch(authController.protect, usersController.updateUser)
  .get(
    authController.protect,
    authController.restrictTo('lead-admin'),
    usersController.getUserList
  );

module.exports = router;
