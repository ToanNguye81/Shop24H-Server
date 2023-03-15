// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import course controller
const orderDetailController = require("../controllers/orderDetailController")

router.get("/orderDetails",  orderDetailController.getAllOrderDetail)

router.post("/orderDetails",  orderDetailController.createOrderDetail)

router.get("/orderDetails/:orderDetailId",  orderDetailController.getOrderDetailById)

router.put("/orderDetails/:orderDetailId",  orderDetailController.updateOrderDetailById)

router.delete("/orderDetails/:orderDetailId",  orderDetailController.deleteOrderDetailById)

router.get("/orders/:orderId/orderDetails",  orderDetailController.getAllOrderDetailOfOrder)

router.post("/orders/:orderId/orderDetails",  orderDetailController.createOrderDetailOfOrder)


module.exports = router;