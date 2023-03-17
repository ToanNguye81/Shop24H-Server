// Khai báo thư viện ExpressJS
const express = require("express");


// Khai báo router app
const router = express.Router();

// Import customer middleware
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");
// Import course controller
const customerController = require("../controllers/customerController")
const authMiddlewares = require("../middlewares/authMiddleware")

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
    userMiddleware.authenticateUser,
    userMiddleware.authorizeUser(['manager']),
    customerController.deleteCustomerById)



router.get("/auth",
    authMiddlewares.authFireBase,
    customerController.getCustomerByEmail)

module.exports = router;