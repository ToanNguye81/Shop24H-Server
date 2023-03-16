// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import product middleware

// Import course controller
const productController = require("../controllers/productController")

router.get("/products", productController.getAllProduct)

router.post("/products", productController.createProduct)

router.get("/products/:productId", productController.getProductById)

router.put("/products/:productId", productController.updateProductById)

router.delete("/products/:productId", productController.deleteProductById)

module.exports = router;