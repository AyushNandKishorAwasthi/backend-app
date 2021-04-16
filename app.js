const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json(), morgan('dev')); // https://www.geeksforgeeks.org/express-js-express-json-function/

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome user');
});

const controller = require('./Controller/Controller');
const protected = require('./Controller/Protected');

app
  .route('/protectedRoute/welcomeUser')
  .get(protected.protect, controller.welcomeUser);
app.post('/registration', controller.registration);
app.post('/verifyotp', controller.verifyOtp);
app.post('/login', controller.login);
app.post('/forgotpassword', controller.forgotPassword);
app.post('/resetpassword', controller.resetPassword);

module.exports = app;
