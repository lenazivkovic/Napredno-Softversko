const express = require('express');
const helmet = require('helmet'); 
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const cors = require('cors');
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
const corsOptions = { credentials: true };
if (process.env.NODE_ENV === 'Development') corsOptions.origin = '*';

app.use(cors(corsOptions));

app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());

app.use('/backend/public/imgs', express.static(`${__dirname}/public/imgs`));

const storeRouter = require('./routes/storeRoutes');
const usersRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const commentRouter = require('./routes/commentRoutes');
const orderRouter = require('./routes/orderRoutes');

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/orders', orderRouter);

module.exports = app;


  //AKO ZEZA CORS ZAKOMENTARISI
//standard u express aplikacijama, za bezbednost