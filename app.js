var express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json()); // https://www.geeksforgeeks.org/express-js-express-json-function/
mongoose.connect(
  'mongodb+srv://clustor0:ayushnk@cluster0.rpg4y.mongodb.net/registration',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const port = 3000;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Database Clustor 0, database name=> Registration');
});

app.get('/', (req, res) => {
  res.send('Welcome user');
});

const controller = require('./Controller/Controller');

app.post('/registration', controller.registration);
app.post('/verifyotp', controller.verifyOtp);
app.post('/login', controller.login);
app.post('/forgotpassword', controller.forgotPassword);
app.post('/resetpassword', controller.resetPassword);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
