const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.FROM,
    pass: process.env.PASSWORD,
  },
  // https://ethereal.email/create
});

exports.generateOTP = function () {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
  // https://www.geeksforgeeks.org/javascript-program-to-generate-one-time-password-otp/
};
