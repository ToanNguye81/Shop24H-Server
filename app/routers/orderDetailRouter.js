// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import orderDetail middleware
const orderDetailMiddleware = require("../middlewares/orderDetailMiddleware");

// Import course controller
const orderDetailController = require("../controllers/orderDetailController")

router.get("/orderDetails", orderDetailMiddleware.getAllOrderDetailMiddleware, orderDetailController.getAllOrderDetail)

router.post("/orderDetails", orderDetailMiddleware.createOrderDetailMiddleware, orderDetailController.createOrderDetail)

router.get("/orderDetails/:orderDetailId", orderDetailMiddleware.getOrderDetailMiddleware, orderDetailController.getOrderDetailById)

router.put("/orderDetails/:orderDetailId", orderDetailMiddleware.updateOrderDetailMiddleware, orderDetailController.updateOrderDetailById)

router.delete("/orderDetails/:orderDetailId", orderDetailMiddleware.deleteOrderDetailMiddleware, orderDetailController.deleteOrderDetailById)

router.get("/orders/:orderId/orderDetails", orderDetailMiddleware.getAllOrderDetailOfOrderMiddleware, orderDetailController.getAllOrderDetailOfOrder)

router.post("/orders/:orderId/orderDetails", orderDetailMiddleware.createOrderDetailOfOrderMiddleware, orderDetailController.createOrderDetailOfOrder)


module.exports = router;