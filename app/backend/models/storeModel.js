const mongoose = require('mongoose');
//const geocoder = require('../utils/geocoder');

const categories = [
  'Restoran',
  'Brza hrana',
  'Supermarket',
  'Apoteka',
  'Butik',
];

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  //adresa se dodaje kad se pravi objekat, kroz middleware se konvertuje u geojason format location
  address: {
    //mora da se prosledi americki format adrese
    type: String,
    //required: [true, 'Please add an address'],
  },

  location: {
    //geojson format
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      //required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formatedAddress: String,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Product',
  },
  logoImage: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: categories,
    required: true,
  },
  averageReview: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  orderHistory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Order',
    default: [],
  },
});

//Geocode & create location
// storeSchema.pre('save', async function (next) {
//   // const pomNiz = this.address.split(' ');
//   // const l = pomNiz[0].length;
//   // if (pomNiz[0][l - 1] === '1' && pomNiz[0][l - 2] !== '1') pomNiz[0] += 'st';
//   // else if (pomNiz[0][l - 1] === '2' && pomNiz[0][l - 2] !== '1')
//   //   pomNiz[0] += 'nd';
//   // else if (pomNiz[0][l - 1] === '3' && pomNiz[0][l - 2] !== '1')
//   //   pomNiz[0] += 'rd';
//   // else pomNiz[0] += 'th';

//   // const adresa = pomNiz.join(' ');
//   // console.log(adresa);
//   if (this.address !== undefined) {
//     const loc = await geocoder.geocode(this.address);
//     this.location = {
//       type: 'Point',
//       coordinates: [loc[0].longitude, loc[0].latitude],
//       formatedAddress: loc[0].formattedAddress,
//     };
//     //Do not save address
//     this.address = undefined;
//   }
//   next();
// });

const Store = mongoose.model('Store', storeSchema);
module.exports = { Store, categories };
