//Gotov
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    role: {
      type: String,
      enum: ['user', 'store-admin', 'lead-admin'],
      default: 'user',
    },
    address: {
      type: String,
      required: true,
    },
    orderHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'Order',
    },
    store: {
      //za slucaj da je korisnik admin moramo da znamo za koju prodavnicu je zaduzen
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },
    reviewedStores: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Store',
      default: [],
    },
    reviewedProducts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
    lastViewed:{
      type:[mongoose.Schema.Types.ObjectId],
      ref:'Product',
      default:[],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timeStamps: true,
  }
);

userSchema.pre('save', async function (next) {
  //.pre je middleware na nivou modela, pokrece se pre svakog save
  if (!this.isModified('password')) {
    console.log('NNIJJJEEE MENJANAAA');
    return next();
  } //ako sifra nije modifikovana ne enkriptuj(npr user je izmenio samo email)
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //instance method, funkcija koja moze da se pozove za objekat klase User
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); //konvertuje Date u int, u milisekunde
    return jwtTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  console.log(this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
