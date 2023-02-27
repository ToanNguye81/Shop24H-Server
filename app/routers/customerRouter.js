// Khai báo thư viện ExpressJS
const express = require("express");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

// Khai báo router app
const router = express.Router();

// Import customer middleware
const customerMiddleware = require("../middlewares/customerMiddleware");

// Import course controller
const customerController = require("../controllers/customerController")

router.get("/customers",
    // customerMiddleware.getAllCustomerMiddleware,
    userMiddleware.authenticateUser,
    userMiddleware.authorizeUser(['manager']),
    customerController.getAllCustomer)

router.post("/customers",
    customerMiddleware.createCustomerMiddleware,
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.createCustomer)

router.get("/customers/:customerId",
    // customerMiddleware.getCustomerMiddleware,
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager']),
    customerController.getCustomerById)

router.put("/customers/:customerId",
    customerMiddleware.updateCustomerMiddleware,
    userMiddleware.authenticateUser,
    userMiddleware.authorizeUser(['manager']),
    customerController.updateCustomerById)

router.delete("/customers/:customerId",
    customerMiddleware.deleteCustomerMiddleware,
    userMiddleware.authenticateUser,
    userMiddleware.authorizeUser(['manager']),
    customerController.deleteCustomerById)

module.exports = router;