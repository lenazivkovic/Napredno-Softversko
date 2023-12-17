//Gotov

const mongoose = require('mongoose');

const categories = [
  'Hrana',
  'Pice',
  'Garderoba',
  'Namirnice',
  'Higijena',
  'Ostalo',
];
const subcategories = [
  'Peciva',
  'Tradicionalna',
  'Internacionalna',
  'Palacinke',
  'Sendvici',
  'Salate',
  'Rostilj',
  'Slatkisi',
  'Grickalice',
  'Alkohol',
  'Sokovi',
  'Bezalkoholna',
  'Muska',
  'Zenska',
  'Lepota i nega',
  'Parfemi',
  'Licna zastita',
  'Suplementi',
  'Mlecni proizvodi',
  'Mesni proizvodi',
  'Voce',
  'Povrce',
];

const productScheema = mongoose.Schema(
  {
    //pamtimo koji korisnik je dodao proizvod

    name: {
      type: String,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Store',
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    subcategory: {
      type: String,
      enum: subcategories,
      validate: {
        validator: function (el) {
          switch (el) {
            case 'Peciva':
            case 'Tradicionalna':
            case 'Internacionalna':
            case 'Palacinke':
            case 'Sendvici':
            case 'Salate':
            case 'Rostilj':
              if (this.category !== 'Hrana') return false;
              break;
            case 'Alkohol':
            case 'Sokovi':
            case 'Bezalkoholna':
              if (this.category !== 'Pice') return false;
              break;
            case 'Muska':
            case 'Zenska':
              if (this.category !== 'Garderoba') return false;
              break;
            case 'Lepota i nega':
            case 'Parfemi':
            case 'Licna zastita':
            case 'Suplementi':
              if (this.category !== 'Higijena') return false;
              break;
            case 'Mlecni proizvodi':
            case 'Mesni proizvodi':
            case 'Voce':
            case 'Povrce':
            case 'Slatkisi':
            case 'Grickalice':
              if (this.category !== 'Namirnice') return false;
              break;
            default:
              return true;
          }
          return true;
        },
        message: `Category ${this.category} and subcategory ${this.subcategory} don't match`,
      },
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    diabetic: {
      type: Boolean,
    },
    pregnantFriendly: {
      type: Boolean,
    },
    vegan: {
      type: Boolean,
    },

    vegeterian: {
      type: Boolean,
    },

    lastPiece: {
      type: Boolean,
    },
    faulty: {
      type: Boolean,
    },
    ecoFriendly: {
      type: Boolean,
    },
    fat: {
      type: Number,
      required: false,
    },
    protein: {
      type: Number,
      required: false,
    },
    carboHydrates: {
      type: Number,
      required: false,
    },
    energy: {
      type: Number,
      required: false,
    },
    expirationDate: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 0,
      required: false,
    },
    numReviews: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  {
    timeStamps: true,
  }
);

const Product = mongoose.model('Product', productScheema);

module.exports = { Product, categories, subcategories };
