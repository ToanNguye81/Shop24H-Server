// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import Order middleware
const orderMiddleware = require("../middlewares/orderMiddleware");

// Import course controller
const orderController = require("../controllers/orderController")

router.get("/orders", orderMiddleware.getAllOrderMiddleware, orderController.getAllOrder)

router.post("/orders", orderMiddleware.createOrderMiddleware, orderController.createOrder)

router.get("/orders/:orderId", orderMiddleware.getOrderMiddleware, orderController.getOrderById)

router.put("/orders/:orderId", orderMiddleware.updateOrderMiddleware, orderController.updateOrderById)

router.delete("/orders/:orderId", orderMiddleware.deleteOrderMiddleware, orderController.deleteOrderById)

router.get("/customers/:customerId/orders", orderMiddleware.getAllOrderOfCustomerMiddleware, orderController.getAllOrderOfCustomer)

router.post("/customers/:customerId/orders", orderMiddleware.createOrderOfCustomerMiddleware, orderController.createOrderOfCustomer)

module.exports = router;