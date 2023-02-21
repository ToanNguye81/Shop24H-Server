
//Ver 3 =========================================

const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

router.post('/signup', userMiddleware.validateSignup, userController.signup);
router.post('/login', userMiddleware.validateLogin, userController.login);
router.get('/users', userMiddleware.authenticateUser, userMiddleware.authorizeUser(['manager',"employee","customer",]), userController.getUsers);
router.get('/:id', userMiddleware.authenticateUser, userMiddleware.authorizeUser(['manager', 'employee']), userController.getUserById);
router.put('/:id', userMiddleware.authenticateUser, userMiddleware.authorizeUser(['manager', 'employee']), userController.updateUser);
router.delete('/:id', userMiddleware.authenticateUser, userMiddleware.authorizeUser(['manager']), userController.deleteUser);

module.exports = router;