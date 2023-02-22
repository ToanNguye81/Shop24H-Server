
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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
  // console.log(req.cookies.token)
  try {
    const token = req.cookies.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    // console.log(req.body.userId)
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user Id';
    } else {
      req.userId = userId;
      console.log("authenticate User success")
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Invalid request' });
  }
};


//Authorize User
const authorizeUser = (allowedRoles) => {
  return (req, res, next) => {
    User.findById(req.userId)
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

// // validate 
// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

//   return res.status(422).json({
//     errors: extractedErrors,
//   });
// };

module.exports = {
  validateSignup,
  validateLogin,
  authenticateUser,
  authorizeUser,
  // validate
};