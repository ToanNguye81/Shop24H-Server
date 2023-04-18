
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

//Validate SignUp
const validateSignup = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

//Validate Login
const validateLogin = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

//authenticate User - xác thực người dùng
const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user Id';
    } else {
      req.userId = userId;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Invalid request' });
  }
};


//Authorize User
const authorizeUser = (allowedRoles) => {
  return (req, res, next) => {
    user.findById(req.userId)
      .then(user => {
        if (!user) {
          console.log("Không tìm thấy user")
          return res.status(404).json({ message: 'User not found' });
        }
        if (allowedRoles.includes(user.role)) {
          console.log("Cho phép truy cập")
          next();
        } else {
          console.log("Access denied")
          return res.status(403).json({ message: 'Access denied' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  }
};

module.exports = {
  validateSignup,
  validateLogin,
  authenticateUser,
  authorizeUser,
  // validate
};