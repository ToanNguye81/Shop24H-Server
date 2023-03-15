// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();


// // Import course controller
const customerController = require("../controllers/customerController")
const authMiddlewares =require("../middlewares/authMiddleware")

router.get("/auth",
    authMiddlewares.authFireBase,
    customerController.getAllCustomer)

router.post("/auth",
    authMiddlewares.authFireBase,
    customerController.updateCustomerById)

module.exports = router;