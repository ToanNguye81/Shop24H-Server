const express = require('express');
const { register, login } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/userMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin', verifyToken, checkRole('admin'), (req, res) => {
  res.send('Admin page');
});
router.get('/user', verifyToken, (req, res) => {
  res.send('User page');
});

module.exports = router;