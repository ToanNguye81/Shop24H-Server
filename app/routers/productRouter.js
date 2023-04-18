// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import product middleware
const userMiddleware = require("../middlewares/userMiddleware");

// Import course controller
const productController = require("../controllers/productController")


// Get product Router
router.get("/products", productController.getAllProduct)
router.get("/products/:productId",productController.getProductById)

// Create product Router
router.post("/products",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager','employee']),
    productController.createProduct)

// Update product Router    
router.put("/products/:productId",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager','employee']),
    productController.updateProductById)

// Delete product Router  
router.delete("/products/:productId",
    // userMiddleware.authenticateUser,
    // userMiddleware.authorizeUser(['manager','employee']),
    productController.deleteProductById)

module.exports = router;