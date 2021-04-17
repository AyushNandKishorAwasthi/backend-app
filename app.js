const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json()); // https://www.geeksforgeeks.org/express-js-express-json-function/
app.get('/', (req, res) => {
  res.send('Welcome user');
});
const protected = require('./Controller/Protected');
const controller = require('./Controller/Controller');
app
  .route('/protectedRoute/welcomeuser')
  .get(protected.protect, controller.welcomeUser);
app.post('/registration', controller.registration);
app.post('/verifyotp', controller.verifyOtp);
app.post('/login', controller.login);
app.post('/forgotpassword', controller.forgotPassword);
app.post('/resetpassword', controller.resetPassword);

module.exports = app;
