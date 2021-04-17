const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../Model/User');

exports.protect = async (req, res, next) => {
  try {
    // 1) Check if token exists then 2)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
      res
        .status(401)
        .json({ msg: 'You are not logged in, please login again' });
    // 2) Verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decode);
    // 3) Check if user exists
    const checkUser = await User.findById(decode.id);
    if (!checkUser) res.status(401).json({ msg: 'The user does not exists' });
    next();
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
};
