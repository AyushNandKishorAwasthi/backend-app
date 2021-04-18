const express = require('express');
const app = express();
app.use(express.json()); // https://www.geeksforgeeks.org/express-js-express-json-function/
app.get('/', (req, res) => {
  res.send('Welcome user');
});

const controller = require('./Controller/Controller');

app.post('/registration', controller.registration);
app.post('/verifyotp', controller.verifyOtp);
app.post('/login', controller.login);
app.post('/forgotpassword', controller.forgotPassword);
app.post('/resetpassword', controller.resetPassword);

module.exports = app;
