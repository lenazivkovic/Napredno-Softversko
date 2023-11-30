// const multer = require('multer');
const {
  Product,
  categories,
  subcategories,
} = require('../models/productModel');
const { Store } = require('../models/storeModel');
const Response = require('./responseController');
const User = require('../models/userModel');
const fs = require('fs');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'backend/public/imgs');
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   //reject
//   if (
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/png'
//   )
//     cb(null, true);
//   else cb(new Error('Only accepting jpeg and png files'), false);
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });

// exports.addImage = upload.single('image');

exports.addProductToStore = async (req, res) => {
  try {
    //console.log(req.file);
    console.log(req.file);
    const prodProps = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...req.body,
      store: req.user.store,
      image: req.file.path,
    };
    //console.log(prodProps.store);
    const newProduct = await Product.create(prodProps);
    //console.log(newProduct);
    const store = await Store.findById(req.user.store);
    store.products.push(newProduct);
    await store.save();
    res.status(200).json({
      status: 'success',
      data: newProduct,
    });
  } catch (err) {
    console.log(':(');
    console.log(err.message);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    console.log('Uso sam');
    //1. Izbrisi proizvod iz baze
    const deletedProd = await Product.findOneAndDelete({
      _id: req.params.id,
      store: req.user.store,
    });
    if (!deletedProd) {
      return Response.failedOperation(
        404,
        "Product wasn't found in your store",
        res
      );
    }

    //2.Nadji prodavnicu u bazi koja je sadrzala taj proizvod
    const storeOwner = await Store.findById(req.user.store);

    //4.Izbrisi proizvod iz liste proizvoda te prodavnice
    const index = storeOwner.products.indexOf(deletedProd._id);
    if (index !== -1) {
      storeOwner.products.splice(index, 1);
    }
    await fs.unlink(deletedProd.image, () => {
      console.log('Product image deleted');
    });
    await storeOwner.save();
    Response.successfulOperation(200, deletedProd, res);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getProductsFromStore = async (req, res) => {
  try {
    const matchingObj = {};
    if (req.query.product) matchingObj.name = req.query.product;
    const products = await Store.findById(req.query.id)
      .populate({
        path: 'products',
        match: matchingObj,
      })
      .select('products');
    if (!products) return Response.failedOperation(404, 'Store not found', res);
    Response.successfulOperation(200, products, res);
  } catch (err) {
    Response.failedOperation(500, err, res);
  }
};

exports.getProductById = async (req, res) => {
  try {
  const product = await Product.findById(req.params.id);
  if (!product)
  return Response.failedOperation(404, 'product not found', res);
  if (!req.user) return Response.successfulOperation(200, product, res);
  
  const prevLastViewed = (
  await User.findById(req.user._id)
  .populate('lastViewed')
  .select('lastViewed')
  ).lastViewed;
  
  let newLastViewed = [
  product,
  ...prevLastViewed.filter((p) => !p._id.equals(product._id)),
  ];
  
  newLastViewed = newLastViewed.slice(0, 10);
  console.log(newLastViewed);
  const userInDb = await User.findByIdAndUpdate(
  req.user._id,
  {
  lastViewed: newLastViewed,
  },
  {
  new: true,
  }
  );
  
  Response.successfulOperation(200, product, res);
  } catch (err) {
  Response.failedOperation(500, err, res);
  }
  };

exports.getProductCategories = async (req, res) => {
  Response.successfulOperation(200, categories, res);
};

exports.getProductSubcategories = async (req, res) => {
  Response.successfulOperation(200, subcategories, res);
};

exports.findProducts = async (req, res) => {
  try {
    //console.log(req.query);
    /////////////////////////////
    const { query } = req;
    const pageSize = query.pageSize || 9;
    const page = query.page || 1;
    const category = query.category || '';
    const subcategory = query.subcategory || '';
    const price = query.price || '';
    const order = query.order || '';
    const searchQuery = query.searchQuery || '';
    const minRating = query.minRating || 0;
    const fat = query.fat || '';
    const protein = query.protein || '';
    const carbohydrates = query.ugljenihidrati || '';
    const diabetic = query.diabetic || false;
    const vegan = query.vegan || false;
    const vegetarian = query.vegeterian || false;
    const pregnantFriendly = query.trudnica || false;
    const lastPiece = query.lastPiece || false;
    const ecoFriendly = query.eco || false;
    const expiring = query.exp || false;
    const faulty = query.faulty || false;

    console.log(req.query);

    // console.log('Ugljeni hh ::', req.query.ugljenihidrati);

    //console.log('Ovo je minRating: ', minRating);

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
    const subCategoryFilter =
      subcategory && subcategory !== 'all' //ako postoji i ako nije jednak sa all
        ? { subcategory }
        : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'newest'
        ? { expirationDate: -1 }
        : order === 'top-rated'
        ? { rating: -1 }
        : order === 'worst-rated'
        ? { rating: 1 }
        : { _id: -1 };

    // console.log(price[1]);
    const priceFilter =
      price && price != 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    //console.log("min rating: ", minRating);
    const ratingFilter =
      minRating && minRating != 'all'
        ? {
            rating: { $gte: minRating },
          }
        : {};

    console.log('Protein:: ', req.query.protein);
    const proteinFilter =
      protein && protein !== 'all'
        ? {
            protein: {
              $gte: Number(protein.split('-')[0]),
              $lte: Number(protein.split('-')[1]),
            },
          }
        : {};
    //console.log(fat);
    const fatFilter =
      fat && fat !== 'all'
        ? {
            fat: {
              $gte: Number(fat.split('-')[0]),
              $lte: Number(fat.split('-')[1]),
            },
          }
        : {};
    //console.log('CarboHydrates: ', carbohydrates);
    const carboHydratesFilter =
      carbohydrates && carbohydrates != 'all'
        ? {
            carboHydrates: {
              $gte: Number(carbohydrates.split('-')[0]),
              $lte: Number(carbohydrates.split('-')[1]),
            },
          }
        : {};
    //console.log(typeof diabetic);

    const diabeticBool = diabetic == 'true' ? true : false;

    const diabeticFilter =
      diabetic != 'all'
        ? {
            diabetic: diabeticBool,
          }
        : {};

    const veganBool = vegan == 'true' ? true : false;

    const veganFilter =
      vegan != 'all'
        ? {
            vegan: veganBool,
          }
        : {};
    const vegeterianBool = vegetarian == 'true' ? true : false;
    const vegetarianFilter =
      vegetarian != 'all'
        ? {
            vegeterian: vegeterianBool,
          }
        : {};

    const pregnantBool = pregnantFriendly == 'true' ? true : false;
    const pregnantFilter =
      pregnantFriendly != 'all'
        ? {
            pregnantFriendly: pregnantBool,
          }
        : {};
    const lastPieceBool = lastPiece == 'true' ? true : false;
    const lastPieceFilter =
      lastPiece != 'all'
        ? {
            lastPiece: lastPieceBool,
          }
        : {};
    const ecoBool = ecoFriendly == 'true' ? true : false;
    const ecoFriendlyFilter =
      ecoFriendly != 'all'
        ? {
            ecoFriendly: ecoBool,
          }
        : {};
    const faultyBool = faulty == 'true' ? true : false;
    const faultyFilter =
      faulty != 'all'
        ? {
            faulty: faultyBool,
          }
        : {};

    const expiringFilter =
      expiring != 'false' && expiring != 'all'
        ? {
            expirationDate: {
              $exists: true,
            },
          }
        : {};

    //console.log('req.params.storeId = ' + req.params.storeId);
    const storeKojaTreba = await Store.findById(req.params.storeId);

    if (!storeKojaTreba)
      return Response.failedOperation(404, 'Store not found', res);

    const ob = {
      store: storeKojaTreba._id,
      ...queryFilter,
      ...categoryFilter,
      ...subCategoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...proteinFilter,
      ...fatFilter,
      ...carboHydratesFilter,
      ...diabeticFilter,
      ...vegetarianFilter,
      ...veganFilter,
      ...pregnantFilter,
      ...lastPieceFilter,
      ...ecoFriendlyFilter,
      //...expiringFilter,
      ...faultyFilter,
    };
    //console.log(ob);

    const products = await Product.find({
      store: storeKojaTreba._id,
      ...queryFilter,
      ...categoryFilter,
      ...subCategoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...proteinFilter,
      ...fatFilter,
      ...carboHydratesFilter,
      ...diabeticFilter,
      ...vegetarianFilter,
      ...veganFilter,
      ...pregnantFilter,
      ...lastPieceFilter,
      ...ecoFriendlyFilter,
      ...expiringFilter,
      ...faultyFilter,
    })
      .sort(sortOrder)
      .skip(Number(pageSize) * (page - 1))
      .limit(Number(pageSize));

    // for (let i = 0; i < products.length; i++) {
    //   if (product[i].expirationDate < new Date(Date.now()).toISOString()) {
    //     product[i].name = 'ISTEKO ROKKKK';
    //   }
    // }

    const countProducts = await Product.countDocuments({
      store: storeKojaTreba._id,
      ...queryFilter,
      ...categoryFilter,
      ...subCategoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...proteinFilter,
      ...fatFilter,
      ...carboHydratesFilter,
      ...diabeticFilter,
      ...vegetarianFilter,
      ...veganFilter,
      ...pregnantFilter,
      ...lastPieceFilter,
      ...ecoFriendlyFilter,
      ...expiringFilter,
    });

    Response.successfulOperation(
      200,
      {
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      },
      res
    );
    //console.log('opa');
  } catch (err) {
    console.log(err.message);
    Response.failedOperation(500, err.message, res);
  }
};

exports.newRating = async (req, res) => {
  try {
    //proveravamo da li je korisnik vec ocenio proizvod
    if (req.user.reviewedProducts.includes(req.params.id))
      return Response.failedOperation(400, 'Product already reviewed', res);

    const product = await Product.findById(req.params.id);

    if (!product)
      return Response.failedOperation(404, 'product not found', res);
    const updatedRating =
      (product.rating * product.numReviews + req.body.rating) /
      (product.numReviews + 1);
    product.rating = updatedRating;
    product.numReviews = product.numReviews + 1;
    const updatedProduct = await product.save({
      new: true,
    });

    req.user.reviewedProducts.push(req.params.id);
    // console.log(req.user.reviewedProducts);
    await User.findByIdAndUpdate(req.user._id, {
      reviewedProducts: req.user.reviewedProducts,
    });

    Response.successfulOperation(200, updatedProduct, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.file) req.body.image = req.file.path;
    //console.log(req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        //category: req.body.category,
        store: req.body.store,
        // subcategory: req.body.subcategory,
        description: req.body.description,
        countInStock: req.body.countInStock,
        vegan: req.body.vegan,
        diabetic: req.body.diabetic,
        vegeterian: req.body.vegeterian,
        ecoFriendly: req.body.ecofriendly,
        pregnantFriendly: req.body.pregnantfriendly,
        lastPiece: req.body.lastpiece,
        faulty: req.body.faulty,
        energy: req.body.energy,
        fat: req.body.fat,
        expirationDate: req.body.expirationDate,
        protein: req.body.protein,
        carboHydrates: req.body.carboHydrates,
        image: req.body.image,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    Response.successfulOperation(200, updatedProduct, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.getProductsAdmin = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 12;
    const page = req.query.page;
    const products = await Product.find({ store: req.user.store })
      .skip(Number(pageSize) * (page - 1))
      .limit(Number(pageSize));

    const countProducts = await Product.countDocuments({
      store: req.user.store,
    });

    Response.successfulOperation(
      200,
      {
        products: products,
        page: page,
        pages: Math.ceil(countProducts / pageSize),
      },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        image: req.file.path,
      },
      {
        new: true,
      }
    );
    Response.successfulOperation(200, { product: updatedProduct }, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
