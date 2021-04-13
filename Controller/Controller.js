const nodemailer = require('nodemailer');
var User = require('../Model/User.js');
const transporter = nodemailer.createTransport({
  host: 'sg2plcpnl0089.prod.sin2.secureserver.net',
  port: 587,
  secure: false,
  auth: {
    user: 'ayush@websultanate.com',
    pass: 'Welcome@123',
  },
  // https://ethereal.email/create
});

function generateOTP() {
  var digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
  // https://www.geeksforgeeks.org/javascript-program-to-generate-one-time-password-otp/
}
//////////////////////////////////////////////Registration API////////////////////////////////
exports.registration = async (req, res) => {
  try {
    let otp = generateOTP();
    let date = new Date();
    const userData = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      dob: req.body.dob,
      updatedOn: date,
      addedOn: date,
      otp: otp,
      fOtp: null,
      isValid: false,
    });
    userData.password = userData.generateHash(req.body.password);
    const savedData = await userData.save(userData);
    console.log('This is your savedData====', savedData);
    res.status(200).json(savedData);
    console.log('Data Saved Successfully to the database Registration');
    // send mail with defined transport object
    var mailOptions = {
      from: 'ayush@websultanate.com',
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
    if (err.code == 11000) {
      let {
        keyValue: { email, username },
      } = err;
      if (email) res.status(401).json({ msg: 'Email already exists' });
      else if (username)
        res.status(401).json({ msg: 'Username already exists' });
    } else if (err.errors.email.message)
      res.status(403).json({ msg: err.errors.email.message });
    else if (err.errors) res.status(403).json({ msg: err });
  }
};
//////////////////////////////////////////////OTP Verification API////////////////////////////////
exports.verifyOtp = async (req, res) => {
  try {
    const verifyData = await User.findOne({ email: req.body.email });
    if (verifyData == null) throw verifyData;
    else if (!verifyData.verifyOtp(req.body.otp)) {
      res.status(401).json({ msg: 'OTP did not verified' });
    } else {
      res.status(200).json({ msg: 'OTP verified' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Please enter correct email' });
  }
};
//////////////////////////////////////////////////// Login API ////////////////////////////////////////////////////////////////
exports.login = async (req, res) => {
  try {
    const loginData = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (!loginData.validPassword(req.body.password)) {
      res.status(401).json({ msg: 'Password did not matched' });
    } else {
      res.status(200).json({ msg: 'Password matched, you are logged in' });
    }
  } catch (err) {
    res.status(401).json(err);
  }
};
///////////////////////////////////////////////////// Forgot password API /////////////////////////////////////////////////////
exports.forgotPassword = async (req, res) => {
  try {
    let fOtp = generateOTP();
    const forgotData = await User.findOneAndUpdate(
      { email: req.body.email },
      { fOtp: fOtp },
      { new: true }
    );
    console.log('forgotData', forgotData);
    if (forgotData == null) throw forgotData;
    else {
      // send mail with defined transport object
      var mailOptions = {
        from: 'karuna@websultanate.com',
        to: req.body.email,
        subject: 'Otp for forgot password request: ',
        html: `Your OTP is ${fOtp}`, // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('MailOptions----------', mailOptions);
      });

      //https://medium.com/@sarthakmittal1461/to-build-otp-verification-for-2-way-authentication-using-node-js-and-express-9e8a68836d62
      res.status(200).json({ msg: 'OTP sent to your email' });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Incorrect email' });
  }
};
/////////////////////////////////////////////////////////////// Reset Password API //////////////////////////////////////////////////////
exports.resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    console.log('Outside=========', User);
    if (req.body.password !== req.body.cnfpassword)
      res.status(200).json({ msg: 'Passwords does not matched' });
    else {
      const user = new User();
      console.log(user);
      const newPassword = user.generateHash(req.body.cnfpassword);
      console.log('I ran', newPassword);
      const resetData = await User.findOneAndUpdate(
        { $and: [{ email: req.body.email }, { fOtp: req.body.fOtp }] },
        { password: newPassword },
        { new: true }
      );
      console.log('your reset data', resetData);
      if (resetData == null) throw resetData;
      else res.status(200).json({ msg: 'Password Updated' });
    }
  } catch (error) {
    res.status(401).json({ msg: 'Incorrect Email or Otp' });
  }
};
