// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import course controller
const orderController = require("../controllers/orderController")
const userMiddleware = require("../middlewares/userMiddleware");
const { authFireBase } = require("../middlewares/authMiddleware");


router.get("/orders",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager', 'employee']),
    orderController.getAllOrder)

router.post("/orders", orderController.createOrderOfCustomer)

router.get("/orders/:orderId", orderController.getOrderById)

router.put("/orders/:orderId", orderController.updateOrderById)

router.delete("/orders/:orderId", orderController.deleteOrderById)

router.get("/customers/:customerId/orders", orderController.getAllOrderOfCustomer)

router.post("/customers/:customerId/orders", orderController.createOrderOfCustomer)

router.post("/orders/orderByEmail",
    authFireBase ||
    userMiddleware.authenticateUser && userMiddleware.authorizeUser(['manager', 'employee']),
    orderController.createOrderOfCustomerVer2)

module.exports = router;