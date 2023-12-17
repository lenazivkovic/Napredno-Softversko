const Comment = require('../models/commentModel');
const response = require('./responseController');

exports.addComment = async (req, res) => {
  try {
    if (!req.body.store) req.body.store = req.params.storeId;

    req.body.user = req.user._id;

    const newComment = await Comment.create({
      comment: req.body.comment,
      user: req.body.user,
      store: req.body.store,
      createdAt: new Date(Date.now()),
    });
    response.successfulOperation(200, newComment, res);
  } catch (err) {
    response.failedOperation(500, err, res);
  }
};

exports.getCommentsForStore = async (req, res) => {
  try {
    if (!req.body.store) req.body.store = req.params.storeId;
    const reviews = await Comment.find({ store: req.body.store, parentId: null }).populate(
      'childrenComments'
    );
    response.successfulOperation(200, reviews, res);
  } catch (err) {
    response.failedOperation(500, err, res);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return response.failedOperation(
        404,
        { message: 'comment not found' },
        res
      );
    if (
      String(comment.user._id) !== String(req.user._id) &&
      req.user.role !== 'lead-admin'
    )
      return response.failedOperation(
        401,
        { message: 'You are not allowed to delete that comment' },
        res
      );
    if (comment.parentId) {
      const parentComment = await Comment.findById(comment.parentId);
      const index = parentComment.childrenComments.indexOf(comment._id);
      if (index !== -1) {
        parentComment.childrenComments.splice(index, 1);
      }
      await parentComment.save();
    }

    await Comment.findByIdAndDelete(req.params.id);

    response.successfulOperation(200, comment, res);
  } catch (err) {
    console.log(err.message);
    response.failedOperation(500, err, res);
  }
};

exports.editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return response.failedOperation(404, 'comment not found', res);

    if (String(comment.user._id) !== String(req.user._id))
      return response.failedOperation(
        401,
        { message: 'You are not allowed to change that comment' },
        res
      );

    comment.comment = req.body.comment;
    await comment.save;

    response.successfulOperation(200, comment, res);
  } catch (err) {
    response.failedOperation(500, err.message, res);
  }
};

exports.addCommentReply = async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.parentId);
    if (!parentComment)
      return response.failedOperation(404, 'Comment not found', res);
    const newComment = await Comment.create({
      parentId: parentComment._id,
      comment: req.body.comment,
      user: req.user._id,
      store: parentComment.store,
    });

    parentComment.childrenComments.push(newComment._id);
    await parentComment.save();
    response.successfulOperation(200, newComment, res);
  } catch (err) {
    response.failedOperation(500, err.message, res);
  }
};

exports.likeComment = async (req, res) => {
  try {
    const messageId = req.body.messageId;
    const likes = req.body.likes;
    const commentForUpdate = await Comment.findById(messageId);
    if (commentForUpdate.likedBy.includes(req.user._id))
      return response.failedOperation(
        400,
        'You already reacted to this comment',
        res
      );

    // const updatedComment = await Comment.findByIdAndUpdate(
    //   messageId,
    //   {
    //     numOfLikes: likes,
    //   },
    //   {
    //     new: true,
    //   }
    // );
    commentForUpdate.numOfLikes = likes;
    commentForUpdate.likedBy.push(req.user._id);
    await commentForUpdate.save();

    response.successfulOperation(200, commentForUpdate, res);
  } catch (err) {
    response.failedOperation(500, err.message, res);
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const messageId = req.body.messageId;
    const dislikes = req.body.dislikes;
    const commentForUpdate = await Comment.findById(messageId);
    if (commentForUpdate.dislikedBy.includes(req.user._id))
      return response.failedOperation(
        400,
        'You already reacted to this comment',
        res
      );
    commentForUpdate.numOfDislikes = dislikes;
    commentForUpdate.dislikedBy.push(req.user._id);
    await commentForUpdate.save();

    response.successfulOperation(200, commentForUpdate, res);
  } catch (err) {
    response.failedOperation(500, err.message, res);
  }
};

exports.getMoreData = async (req, res) => {
  try {
    const commentIncrement = req.body.commentIncrement;

    const comments = await Comment.find({ store: req.params.storeId })
      .skip(commentIncrement)
      .limit(10);
    response.successfulOperation(200, comments, res);
  } catch (err) {
    response.failedOperation(500, err.message, res);
  }
};
