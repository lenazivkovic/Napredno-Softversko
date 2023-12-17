const Order = require('../models/orderModel');
const { Store } = require('../models/storeModel');
const Response = require('./responseController');
const { Product } = require('../models/productModel');
const User = require('../models/userModel');
const { findByIdAndUpdate } = require('../models/orderModel');
const stripe = require('stripe')(
  'sk_test_51L30LzLotKNp5IjnmUegMeZcJvs2QcCQVeYpdl1YGvRHHYl1vAnuoJgDRp1ARBZFXLoo1DWIP9VUDSYazyR3vRQB00e0VU00vH'
);
exports.createCheckoutSession = async (req, res) => {
  try {
    const addedProducts = req.body.orderItems;
    const addedProductsInfo = [];
    const selectedStores = []; //lista prodavnica

    await addedProducts.forEach((p) => {
      //dodajemo prodavnicu u listu prodavnica (samo ako ona prethodno nije dodata)
      if (!selectedStores.includes(p.store)) selectedStores.push(p.store);

      //pravimo niz objekata potrebnih za order objekat u bazi
      addedProductsInfo.push({
        name: p.name,
        quantity: p.quantity,
        image: p.image,
        price: p.price,
        product: p._id,
      });
    });
    //1. Pravimo order koji cemo da sacuvamo u bazu ako je sve okej
    const newOrder = new Order({
      user: req.user._id,
      totalPrice: req.body.totalPrice,
      paidAt: new Date(Date.now()),
      orderItems: addedProductsInfo,
      stores: selectedStores,
      confirmed: false,
      code: Date.now() + '_' + req.user.email,
    });

    let notFound = false;
    let notEnough = false;
    let foundProducts = [];
    let j = 0;
    let totalCena = 0;
    //proveri da li ima dovoljno svega
    const provera = async (niz) => {
      for (let i = 0; i < niz.length; i++) {
        foundProducts[i] = await Product.findById(niz[i]._id);
        if (!foundProducts[i]) {
          notFound = true;
          return;
        }
        if (foundProducts[i].countInStock < niz[i].quantity) {
          notEnough = true;
          return;
        }

        foundProducts[i].countInStock =
          foundProducts[i].countInStock - niz[i].quantity;
        totalCena += foundProducts[i].price * niz[i].quantity;
      }
    };
    //2. Proveravamo da li naruceni proizvodi postoje i da li ih ima dovoljno
    await provera(addedProducts);
    if (notFound)
      return Response.failedOperation(404, 'Product not found', res);

    if (notEnough)
      return Response.failedOperation(400, 'Not enough in stock', res);

    const saveAllProducts = async (niz) => {
      for (let i = 0; i < niz.length; i++) {
        await niz[i].save();
      }
    };

    //3. Utvrdili smo da je sve okej, pa smanjujemo countInStock porucenih proizvoda
    await saveAllProducts(foundProducts);

    //4. Cuvamo order u bazu
    newOrder.totalPrice = totalCena;
    const savedOrder = await newOrder.save();

    const newOrderHistory = [...req.user.orderHistory, savedOrder._id];
    //5. Dodajemo useru novi order u istoriju ordera
    const userInDb = await User.findByIdAndUpdate(
      req.user._id,
      {
        orderHistory: newOrderHistory,
      },
      {
        new: true,
      }
    );

    //6. Dodamo order u listu ordera prodavnice:
    const addToStoreOrderList = async (storeList, orderToAdd) => {
      for (let i = 0; i < storeList.length; i++) {
        const s = await Store.findById(storeList[i]);
        console.log(s.orderHistory);
        s.orderHistory.push(orderToAdd._id);
        await s.save();
        console.log(s.orderHistory);
      }
    };

    await addToStoreOrderList(selectedStores, savedOrder);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.orderItems.map((item) => {
        return {
          price_data: {
            currency: 'rsd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}orderhistory`, //izmeni
      cancel_url: `${process.env.SERVER_URL}neuspeh?id=${savedOrder._id}`,
    });

    req.user = userInDb;

    Response.successfulOperation(
      200,
      { order: savedOrder, session_url: session.url },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.returnItemsInStock = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return Response.failedOperation(404, { message: 'Order not found' }, res);

    const returnProducts = async (productList) => {
      for (let i = 0; i < productList.length; i++) {
        const p = await Product.findById(productList[i].product);

        p.countInStock = p.countInStock + productList[i].quantity;
        await p.save();
      }
    };
    await returnProducts(order.orderItems);

    const popFromStore = async (storeList) => {
      for (let i = 0; i < storeList.length; i++) {
        const s = await Store.findById(storeList[i]);
        const index = s.orderHistory.indexOf(order._id);
        if (index !== -1) {
          s.orderHistory.splice(index, 1);
        }
        await s.save();
      }
    };

    await popFromStore(order.stores);

    await Order.deleteOne(order);

    Response.successfulOperation(200, { message: 'Ok' }, res);
    console.log('uspeh dzeri');
  } catch (err) {
    console.log(err);
    Response.failedOperation(500, err.message, res);
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        confirmed: true,
      },
      {
        new: true,
      }
    );
    Response.successfulOperation(200, order, res);
    console.log('USPEH IVANA');
  } catch (err) {
    console.log(err);
    Response.failedOperation(500, err.message, res);
  }
};

exports.customerPickUp = async (req, res) => {
  try {
    //console.log("Uso sam :(*(*(*(");
    const order = await Order.findOne({ code: req.params.code });
    //console.log(order);
    var index = order.stores.indexOf(req.user.store);

    //console.log(index);

    if (index !== -1) {
      order.stores.splice(index, 1);
    }

    console.log(req.user);

    if (index === -1)
      return Response.failedOperation(
        411,
        { message: 'Already picked up, or never ordered from this store' },
        res
      );
    await order.save();
    Response.successfulOperation(200, order, res);
  } catch (err) {
    //console.log(err);
    Response.failedOperation(500, err.message, res);
  }
};

exports.getSummary = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 }, //prebroji sve ordere
          totalSales: { $sum: '$totalPrice' }, //saberi totalPrice svih
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 }, //prebroji sve usere
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    Response.successfulOperation(
      200,
      { orders, users, dailyOrders, productCategories },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.getStoreOrderHistory = async (req, res) => {
  try {
    const storeOrderHistory = await Store.findById(req.user.store)
      .populate({
        path: 'orderHistory',
        populate: {
          path: 'user',
          select: 'name',
        },
      })
      .select('orderHistory');

    Response.successfulOperation(200, storeOrderHistory, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.getStoreSummary = async (req, res) => {
  //napravi dailyOrders ako ima vremena
  try {
    const store = await Store.findById(req.user.store)
      .populate('orderHistory')
      .populate('products');
    const orders = [];
    let totalSales = 0;
    const users1 = [];
    const users = [];
    const dailyOrders = [];
    const productCategories = [];
    let numUsers = 0;
    for (let i = 0; i < store.orderHistory.length; i++) {
      //console.log('orderHistory[i].user = ' + store.orderHistory[i].user);
      totalSales += store.orderHistory[i].totalPrice;
      if (!users1.includes(String(store.orderHistory[i].user))) {
        users1.push(String(store.orderHistory[i].user));

        numUsers++;
      }

      //dailyOrders
      const dateString = store.orderHistory[i].paidAt
        .toISOString()
        .split('T')[0];
      const trenutniDate = Date.parse(dateString);
      //const trenutniDate = String(trenutniDateUnformated).split('T')[0];
      let ima = false;
      let j = 0;
      while (!ima && j < dailyOrders.length) {
        if (dailyOrders[j]._id == trenutniDate) {
          dailyOrders[j].orders++;
          ima = true;
        }
        j++;
      }
      if (!ima) {
        dailyOrders.push({ _id: trenutniDate, orders: 1 });
      }
      //productCategories
    }

    for (let i = 0; i < store.products.length; i++) {
      const trenutnaKategorija = store.products[i].category;
      let imaKategoriju = false;
      let k = 0;
      while (!imaKategoriju && k < productCategories.length) {
        if (productCategories[k]._id == trenutnaKategorija) {
          productCategories[k].count++;
          imaKategoriju = true;
        }
        k++;
      }
      if (!imaKategoriju) {
        productCategories.push({ _id: trenutnaKategorija, count: 1 });
      }
    }
    //console.log(users1);
    // const dailyOrders = [
    //   { _id: '2022-5-4', orders: 2, sales: 2 },
    //   { _id: '2022-5-5', orders: 12, sales: 12 },
    // ];
    // const productCategories = [
    //   { _id: 'Pice', count: 5 },
    //   { _id: 'Hrana', count: 4 },
    // ];

    orders.push({ numOrders: store.orderHistory.length, totalSales });
    users.push({ numUsers });
    //console.log(typeof totalSales);
    // console.log(typeof dailyOrders[0]._id);
    Response.successfulOperation(
      200,
      { orders, users, dailyOrders, productCategories },
      res
    );
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.getProductsFromOneStore = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product')
      .select('orderItems');
    const items = [];
    let totalPrice = 0;
    for (let i = 0; i < order.orderItems.length; i++) {
      if (String(order.orderItems[i].product.store) == String(req.user.store)) {
        items.push(order.orderItems[i]);
        totalPrice +=
          order.orderItems[i].product.price * order.orderItems[i].quantity;
      }
    }
    Response.successfulOperation(200, { orderItems: items, totalPrice }, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};

exports.getOrder = async (req, res) => {
  try {
    console.log('USO SAM U KONTROLER LAGANO i id je', req.params.id);
    const order = await Order.findById(req.params.id);
    console.log('naso sam');
    console.log(order);
    if (!order) return Response.failedOperation(404, 'Order not found', res);

    Response.successfulOperation(200, order, res);
    console.log('poslao sam to sto treba');
  } catch (err) {
    console.log(err.message);
    Response.failedOperation(500, err.message, res);
  }
};

exports.searchOrder = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || 'all';

    const queryFilter =
      searchQuery && searchQuery !== 'all' //ako postoji i ako nije jednak sa all
        ? {
            code: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const id = req.user.store;

    const order = await Store.findById(id)
      .populate({
        path: 'orderHistory',
        match: {
          ...queryFilter,
        },
      })
      .select('orderHistory');

    const orders = order.orderHistory;

    if (!order) return Response.failedOperation(404, 'Order not found', res);

    Response.successfulOperation(200, orders, res);
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
