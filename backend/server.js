const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const DB = 'mongodb+srv://merkurswe:Merkurswe123@cluster0.t7yem.mongodb.net/merkur'
//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(con.connections); //stampa informacije o konekciji, izbrisi ako smeta
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'Development') console.log('Jeste stvarno');
});

//
//
