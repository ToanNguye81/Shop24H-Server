// Khai báo thư viện ExpressJS
const express = require("express");


// Khai báo router app
const router = express.Router();

// Import middleware
const userMiddleware = require("../middlewares/userMiddleware");
const authMiddleware = require("../middlewares/authMiddleware")
// Import controller
const userController = require("../controllers/userController");
const customerController = require("../controllers/customerController")

router.get("/customers",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.getAllCustomer)

router.post("/customers",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.createCustomer)

router.get("/customers/:customerId",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.getCustomerById)

router.put("/customers/:customerId",
    userMiddleware.authenticateUser,
    userMiddleware.authorizeUser(['manager']),
    customerController.updateCustomerById)

router.delete("/customers/:customerId",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.deleteCustomerById)


router.get("/auth",
    authMiddleware.authFireBase,
    customerController.getCustomerByEmail)

module.exports = router;