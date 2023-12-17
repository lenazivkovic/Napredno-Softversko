const { Store, categories } = require('../models/storeModel');
const Response = require('./responseController');
const User = require('../models/userModel');
const fs = require('fs');
const { Product } = require('../models/productModel');

exports.createStore = async (req, res) => {
  try {
    req.body.logoImage = req.file.path;
    req.body.location = {
      type: 'Point',
      coordinates: req.body.coordinates,
    };
    console.log('Kategorija: ', req.body.category);

    console.log('Ovde sam :)))))');

    const newStore = await Store.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        store: newStore,
      },
    });
  } catch (err) {
    console.log('Ovde sam :((((');
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllStores = async (req, res) => {
  //vraca po odredjenom kriterijumu.. sortirano..itd
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);
    console.log(req.query);

    let query = Store.find(queryObject); //mozes ovde .populate

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-cratedAt');
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    if (req.query.limit) {
      const limit = 1 * req.query.limit;
      query = query.limit(limit);
    }
    if (req.query.page) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
    }
    const stores = await query;

    res.status(200).json({
      status: 'success',
      data: {
        stores,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getStoreByID = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('products');

    Response.successfulOperation(200, store, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.updateStore = async (req, res) => {
  try {
    if (req.file) req.body.logoImage = req.file.path; //ako je dodata slika
    if (req.body.coordinates) {
      //ako su dodate koordinate
      req.body.location = {
        type: 'Point',
        coordinates: req.body.coordinates,
      };
    }

    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        store,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getStoreCategories = (req, res) => {
  Response.successfulOperation(200, categories, res);
};
//TODO:fetch svih proizvoda na osnovu kriterijuma

exports.getStoresWithin = async (req, res) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'km' ? distance / 6378.1 : distance / 6378100; //centerSphere uzima radiane, a ne metre.

    console.log(radius);

    if (!lat || !lng)
      return Response.failedOperation(
        400,
        'Please provide latitude and longitude in format lat,long',
        res
      );

    const foundStores = await Store.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    Response.successfulOperation(200, foundStores, res);
  } catch (err) {
    Response.failedOperation(500, err, res);
  }
};

exports.findStores = async (req, res) => {
  try {
    console.log(req.query);
    const { query } = req;
    const pageSize = query.pageSize || 9;
    const page = query.page || 1;
    const category = query.category || '';

    //rating
    const rating = query.minRating || 0;

    if (rating < 0 || rating > 5)
      return Response.failedOperation(400, 'Invalid rating', res);

    //order(new,abeceda,rating)
    const order = query.order || '';

    const searchQuery = query.searchQuery || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all' //ako postoji i ako nije jednak sa all
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter =
      category && category !== 'all' //ako postoji i ako nije jednak sa all
        ? { category }
        : {};

    const ratingFilter =
      rating && rating != 'all'
        ? {
            averageReview: {
              $gte: rating,
            },
          }
        : {};
    const sortOrder =
      order === 'lowest'
        ? { averageReview: 1 }
        : order === 'highest'
        ? { averageReview: -1 }
        : order === 'alphabetical'
        ? { name: 1 }
        : { _id: -1 };

    const stores = await Store.find({
      ...queryFilter,
      ...categoryFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countStores = await Store.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...ratingFilter,
    });
    Response.successfulOperation(
      200,
      {
        stores,
        countStores,
        page,
        pages: Math.ceil(countStores / pageSize),
      },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err, res);
  }
};

exports.newReview = async (req, res) => {
  try {
    //proveravamo da li je korisnik vec ocenio prodavnicu
    if (req.user.reviewedStores.includes(req.params.id))
      return Response.failedOperation(400, 'Store already reviewed', res);

    const store = await Store.findById(req.params.id);
    if (!store) return Response.failedOperation(404, 'Store not found', res);
    const updatedReview =
      (store.averageReview * store.numOfReviews + req.body.review) /
      (store.numOfReviews + 1);
    store.averageReview = updatedReview;
    store.numOfReviews = store.numOfReviews + 1;
    const updatedStore = await store.save({
      new: true,
    });
    req.user.reviewedStores.push(req.params.id);
    await User.findByIdAndUpdate(req.user._id, {
      reviewedStores: req.user.reviewedStores,
    });
    Response.successfulOperation(200, updatedStore, res);
  } catch (err) {
    console.log(err.message);
    Response.failedOperation(500, err, res);
  }
};

exports.categoriesAndSubcategoriesFromOneStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('products');
    if (!store) return Response.failedOperation(404, 'Store not found', res);

    const categories = [];
    const subcategories = [];
    const formated = {};

    for (let i = 0; i < store.products.length; i++) {
      if (!categories.includes(store.products[i].category))
        categories.push(store.products[i].category);

      const trenutnaKategorija = store.products[i].category;

      if (!formated[trenutnaKategorija]) formated[trenutnaKategorija] = [];
      if (!formated[trenutnaKategorija].includes(store.products[i].subcategory))
        formated[trenutnaKategorija].push(store.products[i].subcategory);

      if (!subcategories.includes(store.products[i].subcategory))
        subcategories.push(store.products[i].subcategory);
    }

    Response.successfulOperation(
      200,
      { categories, subcategories, formated },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return Response.failedOperation(404, 'Store not found', res);
    await fs.unlink(store.logoImage, ()=>{console.log("logoImage deleted")});

    for (let i = 0; i < store.products.length; i++) {
      console.log('unutar petljice: ' + store.products[i]);
      const p = await Product.findByIdAndDelete(store.products[i]);
      console.log(p);
      await fs.unlink(p.image, () => {});
    }

    Response.successfulOperation(200, 'deleted', res);
  } catch (err) {
    console.log(err.message);
    Response.failedOperation(500, err.message, res);
  }
};

exports.deleteFromOrderHistory = async (req, res) => {
  try {
    console.log('Uso sam');
    const store = await Store.findById(req.user.store);
    //console.log(req.params.id);
    const index = store.orderHistory.indexOf(req.params.orderId);
   // console.log(store.orderHistory.length);
    if (index !== -1) {
      store.orderHistory.splice(index, 1);
    }
    //console.log(store.orderHistory.length);
    await store.save();
    Response.successfulOperation(200, 'deleted', res);
    //console.log('Obrisao sam');
  } catch {
    Response.failedOperation(500, err.message, res);
  }
};
