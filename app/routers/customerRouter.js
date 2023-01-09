// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import customer middleware
const customerMiddleware = require("../middlewares/customerMiddleware");

// Import course controller
const customerController = require("../controllers/customerController")

router.get("/customers", customerMiddleware.getAllCustomerMiddleware, customerController.getAllCustomer)

router.post("/customers", customerMiddleware.createCustomerMiddleware, customerController.createCustomer)

router.get("/customers/:customerId", customerMiddleware.getCustomerMiddleware, customerController.getCustomerById)

router.put("/customers/:customerId", customerMiddleware.updateCustomerMiddleware, customerController.updateCustomerById)

router.delete("/customers/:customerId", customerMiddleware.deleteCustomerMiddleware, customerController.deleteCustomerById)

module.exports = router;