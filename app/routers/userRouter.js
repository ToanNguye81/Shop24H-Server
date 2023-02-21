// // ===============================Ver 1

// const express = require('express');
// const { login,register } = require('../controllers/userController');
// const { verifyToken, checkRole } = require('../middlewares/userMiddleware');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/admin', verifyToken, checkRole('admin'), (req, res) => {
//   res.send('Admin page');
// });
// router.get('/user', verifyToken, (req, res) => {
//   res.send('User page');
// });

// module.exports = router;



//===============================Ver 2

const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['customer', 'admin']).withMessage('Invalid role'),
], userController.signup);

// Route for user login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.login);

// Route for getting current user
router.get('/me', userMiddleware.auth, userController.getCurrentUser);

// Route for updating current user
router.patch('/me', userMiddleware.auth, userController.updateCurrentUser);

// Route for getting all users (admin only)
router.get('/', userMiddleware.auth, userMiddleware.restrictTo('admin'), userController.getAllUsers);

// Route for getting a user by ID (admin only)
router.get('/:id', userMiddleware.auth, userMiddleware.restrictTo('admin'), userController.getUserById);

// Route for updating a user by ID (admin only)
router.patch('/:id', userMiddleware.auth, userMiddleware.restrictTo('admin'), userController.updateUserById);

// Route for deleting a user by ID (admin only)
router.delete('/:id', userMiddleware.auth, userMiddleware.restrictTo('admin'), userController.deleteUserById);

module.exports = router;