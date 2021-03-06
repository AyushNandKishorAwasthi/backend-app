const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../Model/User.js');

const { transporter, generateOTP } = require('./Transporter');

//////////////////////////////////////////////Registration API////////////////////////////////
const { userRegistration } = require('./UserRegistration');
exports.registration = userRegistration;
//////////////////////////////////////////////OTP Verification API////////////////////////////////
exports.verifyOtp = async (req, res) => {
  try {
    const verifyData = await User.findOne({ email: req.body.email });
    // if (verifyData == null) throw verifyData;
    if (!verifyData.verifyOtp(req.body.otp)) {
      res.status(401).json({ msg: 'OTP did not verified' });
    } else {
      res.status(200).json({ msg: 'OTP did verified' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Please enter correct email' });
  }
};
//////////////////////////////////////////////////// Login API ////////////////////////////////////////////////////////////////
exports.login = async (req, res, next) => {
  try {
    const loginData = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    }).select('_id password');
    // if (loginData) throw loginData;
    console.log(loginData);
    if (!loginData.validPassword(req.body.password)) {
      res.status(401).json({ msg: 'Password did not matched' });
    } else {
      const id = loginData._id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });
      next(res.json({ token, id, msg: 'This is login api' }));
    }
  } catch (err) {
    console.log('this is login error======================', err);
    res.status(401).json({ msg: 'Username or email is invalid' });
  }
};
///////////////////////////////////////////////////// Forgot password API /////////////////////////////////////////////////////
exports.forgotPassword = async (req, res) => {
  try {
    let emailfOtp = generateOTP();
    const user = new User();
    const fOtp = user.generateHash(emailfOtp);
    console.log(fOtp);
    const forgotData = await User.findOneAndUpdate(
      { email: req.body.email },
      { fOtp: fOtp },
      { new: true }
    );
    console.log('forgotData', forgotData);
    if (forgotData == null) throw forgotData;
    else {
      // send mail with defined transport object
      const mailOptions = {
        from: process.env.FROM,
        to: req.body.email,
        subject: 'Otp for forgot password request: ',
        html: `Your OTP is ${emailfOtp}`, // html body
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
      res.status(200).json({ msg: 'OTP sent to your email', emailfOtp });
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
      console.log('Inside else here----------------');
      let date = new Date();
      let resetData = await User.findOne({ email: req.body.email });
      if (resetData.verifyfOtp(req.body.fOtp)) {
        console.log('Otp verified');
        resetData.password = resetData.generateHash(req.body.cnfpassword);
        resetData.updatedOn = date;
        resetData.save();
        console.log('your reset data', resetData);
      }
      if (resetData == null) throw resetData;
      else res.status(200).json({ msg: 'Password Updated', resetData });
    }
  } catch (error) {
    res.status(401).json({ msg: error.message, msg2: 'Incorrect Password' });
    //
  }
};

exports.welcomeUser = async (req, res) => {
  res.status(200).json({ msg: 'Welcome user' });
};
