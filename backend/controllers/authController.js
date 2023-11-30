const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
//const response = require('./responseController');

const createToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createAndSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 90 * 24 * 60 * 60 * 1000 //90 dana
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'Production') cookieOptions.secure = true;

  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      address: req.body.address,
    });
    createAndSendToken(newUser, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    //1.Proveri da li je korisnik uneo email i password
    if (!email || !password)
      return res.status(400).json({
        status: 'failed',
        message: 'Please provide us your email and password',
      });
    //2.Proveri da li su email i password tacni
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(400).json({
        status: 'failed',
        message: 'Email or password are incorect',
      });

    //3. Ako je sve u redu vrati klijentu jwt
    createAndSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
exports.setUser = async (req, res, next) => {
  try {
    console.log('83');
    //1.Proveri da li token uopste postoji
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
    console.log('token ' + token);

    if (!token) return next();
    console.log('95');
    //2.Proveri da li je token validan
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3.Proveri da li korisnik nosilac jwt postoji (da profil nije izbrisan)
    const user = await User.findById(decoded.id);
    console.log('100');
    if (!user) return next();

    //5.Ako je sve proslo, dopusti korisniku da pristupi ruti
    req.user = user;
    console.log('103');
   return  next();
  } catch (err) {
    console.log('catch');
    return next();
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1.Proveri da li token uopste postoji
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];

    if (!token)
      return next(
        res.status(401).json({
          status: 'failed',
          message: 'Please login',
        })
      );
    //2.Proveri da li je token validan
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3.Proveri da li korisnik nosilac jwt postoji (da profil nije izbrisan)
    const user = await User.findById(decoded.id);
    if (!user)
      return next(
        res.status(401).json({
          status: 'failed',
          message: "User doesn't exist anymore",
        })
      );

    //4. Proveri da nije lozinka promenjena u medjuvremenu
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        res.status(401).json({
          status: 'failed',
          message: 'Please log in again',
        })
      );
    }
    //5.Ako je sve proslo, dopusti korisniku da pristupi ruti
    req.user = user;
    next();
  } catch (err) {
    // console.log(err.message);
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
   
    const rolesArray = roles[0].split(' ');
   
    if (rolesArray.includes(req.user.role)) return next();

    return next(
      res.status(401).json({
        status: 'failed',
        message: 'You are not allowed to perform that action',
      })
    );
  };

exports.forgotPassword = async (req, res, next) => {
  try {
    //1. Nadji user-a preko email-a
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        res.status(404).json({
          status: 'failed',
          message: 'User not found',
        })
      );
    //2. Generisi random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3. Posalji token preko mail-a
    const resetURL = `http://localhost:3001/InputSifra/${resetToken}`;
    const message = `Forgot password? Submit a PATCH request with your new password and confirm it to ${resetURL}`;
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)!',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //1. Nadji korisnika na osnovu reset tokena
    
    const resetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(404).json({
        status: 'failed',
        message: 'Token is invalid or has expired',
      });
    console.log('USO SAM OVDE 1');
    //2.Ako token nije isteko i nadjen je user, postavi novu sifru
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //3.loginuj korisnika i posalji jwt
    createAndSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    //1. Nadjemo korisnika u bazi
    const user = await User.findById(req.user._id).select('+password');
    //2. Poredimo unetu sifru sa postojecom
    if (!(await user.correctPassword(req.body.oldPassword, user.password)))
      return res.status(404).json({
        status: 'failed',
        message: 'Please enter correct password',
      });
    //3. Ako je okej, postavljamo novu sifru
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();
    //4. Vracamo token
    createAndSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
