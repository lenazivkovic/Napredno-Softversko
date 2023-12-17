const express = require('express');

const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/update-like')
  .patch(authController.protect, commentController.likeComment);
router
  .route('/update-dislike')
  .patch(authController.protect, commentController.dislikeComment);

router.route('/get-more-data/:storeId').get(commentController.getMoreData);

router
  .route('/reply/:parentId')
  .post(authController.protect, commentController.addCommentReply);

router
  .route('/:id')
  .delete(authController.protect, commentController.deleteComment)
  .patch(authController.protect, commentController.editComment);

router
  .route('/')
  .post(authController.protect, commentController.addComment)
  .get(commentController.getCommentsForStore);

module.exports = router;
