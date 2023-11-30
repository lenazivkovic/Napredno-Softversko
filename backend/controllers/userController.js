const User = require('../models/userModel');
const Response = require('./responseController');

exports.deleteUser = async (req, res) => {
  //brisanje profila
  try {
    //1.Proveri da li je uneta sifra tacna
    const userDel = await User.findById(req.user._id).select('+password');

    if (!(await userDel.correctPassword(req.body.password, userDel.password))) {
      return res.status(400).json({
        status: 'failed',
        message: 'Incorrect password',
      });
    }

    await User.deleteOne(userDel);

    res.status(200).json({
      status: 'success',
      message: 'User successfuly deleted',
    });
    //2.ako jeste izbrisi usera
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err,
    });
  }
};
exports.getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    Response.successfulOperation(200, user, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
exports.updateUser = async (req, res) => {
  try {
    const updateParams = {};

    //if (req.body.email) updateParams.email = req.body.email;
    if (req.body.address) updateParams.address = req.body.address;
    if (req.body.name) updateParams.name = req.body.name;
    //console.log(user);
    const user = await User.findByIdAndUpdate(req.user._id, updateParams, {
      new: true,
    });
    // await user.save();
    req.user = user;

    Response.successfulOperation(200, user, res);
  } catch (err) {
    Response.failedOperation(500, err, res);
  }
};
exports.getUserOrderHistory = async (req, res) => {
  try {
    //console.log('ovdeeee');
    const userOrderHistory = await User.findById(req.user._id)
      .populate('orderHistory')
      .select('orderHistory');
    // const results = [];
    // userOrderHistory.orderHistory.forEach((element) => {
    //   results.push({
    //     code: element.code,
    //     date: element.paidAt,
    //     items: element.orderItems,
    //     totalPrice: element.totalPrice,
    //   });
    // });

    Response.successfulOperation(200, userOrderHistory.orderHistory, res);
  } catch (err) {
    console.log(err);
    Response.failedOperation(500, err.message, res);
  }
};

exports.adminUpdateUser = async (req, res) => {
  try {
    if (req.body.role === 'store-admin' && !req.body.store)
      return Response.failedOperation(400, 'Please provide store id', res);
    if (!req.body.store) req.body.store = null;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        store: req.body.store,
      },
      {
        new: true,
      }
    );
    Response.successfulOperation(200, user, res);
  } catch (err) {
    console.log(err.message);
    Response.failedOperation(500, err.message, res);
  }
};

exports.getUserList = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 10;
    const page = req.query.page || 1;
    const searchQueryName = req.query.searchQueryName || '';
    const searchQueryEmail = req.query.searchQueryEmail || '';

    const queryFilterName =
      searchQueryName && searchQueryName !== 'all'
        ? {
            name: {
              $regex: searchQueryName,
              $options: 'i',
            },
          }
        : {};
    const queryFilterEmail =
      searchQueryEmail && searchQueryEmail !== 'all'
        ? {
            email: {
              $regex: searchQueryEmail,
              $options: 'i',
            },
          }
        : {};

    const userList = await User.find({
      ...queryFilterName,
      ...queryFilterEmail,
    })
      .skip(Number(pageSize) * (page - 1))
      .limit(Number(pageSize));
    const userCount = await User.countDocuments({});

    Response.successfulOperation(
      200,
      { users: userList, page: page, pages: Math.ceil(userCount / pageSize) },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.userDeleteByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    Response.successfulOperation(200, 'Deleted', res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
exports.getUserLastViewed = async (req, res) => {

  try {

    const userLastViewed = await User.findById(req.user._id)

      .populate('lastViewed')

      .select('lastViewed');




    Response.successfulOperation(200, userLastViewed.lastViewed, res);

  } catch (err) {

    Response.failedOperation(400, err.message, res);

  }
}
exports.findUsersByMail = async (req, res) => {
  try {
    console.log(req.query);
    const searchQuery = req.query.searchQuery || 'all';
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;

    const queryFilter =
      searchQuery && searchQuery !== 'all' //ako postoji i ako nije jednak sa all
        ? {
            email: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const users = await User.find(queryFilter)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countUsers = await User.countDocuments(queryFilter);

    Response.successfulOperation(
      200,
      { users, countUsers, page, pages: Math.ceil(countUsers / pageSize) },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
