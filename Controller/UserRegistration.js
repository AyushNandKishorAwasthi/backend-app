const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { transporter, generateOTP } = require('./Transporter');
const User = require('../Model/User.js');

exports.userRegistration = async (req, res) => {
  try {
    let otp = generateOTP();
    let date = new Date();
    // let date = new Date().toLocaleString('en-US', {
    //   timeZone: 'Asia/Kolkata',
    // });
    const userData = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      dob: req.body.dob,
      addedOn: date,
      fOtp: null,
      isValid: false,
    });

    userData.password = userData.generateHash(req.body.password);
    userData.otp = userData.generateHash(otp);
    const savedData = await userData.save(userData);
    // if (savedData) throw savedData;
<<<<<<< HEAD
    console.log('This is your savedData====', savedData);
    const token = jwt.sign({ id: savedData._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    res.status(200).json({ token, savedData, otp });
=======
    console.log('This is your savedData====', savedData, otp);
    res.status(200).json({ savedData, otp });
    console.log('Data Saved Successfully to the database Registration');
    // send mail with defined transport object
    const mailOptions = {
      from: process.env.FROM,
      to: req.body.email,
      subject: 'One Time Password for User Account Registration',
      html: `Hi, your otp for email verification is ${otp}`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log('MailOptions----------', mailOptions);
    });
  } catch (err) {
    console.log('This is my error=========================', err);
    if (err.code === 11000) {
      let {
        keyValue: { email, username },
      } = err;
      if (email) res.status(401).json({ msg: 'Email already exists' });
      else if (username)
        res.status(401).json({ msg: 'Username already exists' });
    } else if (err.name === 'ValidationError') {
      console.log('this is your validationError', err);
      res.status(403).json({
        msg: Object.values(err.errors)
          .map((el) => el.message)
          .join(' '),
      });
    } else if (err) res.status(403).json({ msg: err.message });
  }
};
