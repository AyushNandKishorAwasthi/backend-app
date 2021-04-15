const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    minlength: 1,
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    minlength: 1,
  },
  email: {
    type: String,
    unique: true, //https://masteringjs.io/tutorials/mongoose/unique
    required: [true, 'Please enter your email address'],
    validate: [validator.isEmail, 'Please enter your correct email address'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please enter your username'],
  },
  password: {
    type: String,
    required: [true, 'Password must not be less than 4 characters long'],
    minlength: 4,
  },
  dob: Date,
  otp: String,
  fOtp: String,
  updatedOn: Date,
  addedOn: Date,
  isValid: Boolean,
});

//https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb/43094720#:~:text=While%20registering%20a%20user%2C%20you,let's%20call%20it%20P%232%20.

// hash the password
userSchema.methods.generateHash = function (password) {
  if (password.length <= 4) return null;
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//checking if otp is a valid
userSchema.methods.verifyOtp = function (otp) {
  if (otp === this.otp) {
    return true;
  }
  return false;
};

userSchema.methods.verifyfOtp = function (fOtp) {
  if (fOtp === this.fOtp) {
    return true;
  }
  return false;
};
//to insert otp when user requests forget password
// userSchema.methods.forgetPassword=function(fOtp){
//   userSchema.fOtp=fOtp;
//   console.log('OTP Saved Successfully to the database');
// }

const User = mongoose.model('User', userSchema);
module.exports = User;
