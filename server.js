const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect(
  'mongodb+srv://clustor0:ayushnk@cluster0.rpg4y.mongodb.net/registration',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

console.log(process.env.PASSWORD);

const port = 3000;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Database Clustor 0, database name=> Registration');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
