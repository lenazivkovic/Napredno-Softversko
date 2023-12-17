//Gotov
const mongoose = require('mongoose');

const commentScheema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
    childrenComments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
      required: false,
    },
    comment: {
      type: String,
      required: [true, 'Must provide a comment'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Store',
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    numOfDislikes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    dislikedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timeStamps: true,
  }
);

commentScheema.pre(/^find/, function (next) {
  //svaki put kad identifikujes find pokreni fju
  this.populate({
    path: 'store',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const Comment = mongoose.model('Comment', commentScheema);

module.exports = Comment;
