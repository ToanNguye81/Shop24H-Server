// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import productType middleware
const productTypeMiddleware = require("../middlewares/productTypeMiddleware");

// Import course controller
const productTypeController = require("../controllers/productTypeController")

router.post("/productTypes", productTypeMiddleware.createProductTypeMiddleware, productTypeController.createProductType)

router.get("/productTypes", productTypeMiddleware.getAllProductTypeMiddleware, productTypeController.getAllProductType)

router.get("/productTypes/:productTypeId", productTypeMiddleware.getProductTypeMiddleware, productTypeController.getProductTypeById)

router.put("/productTypes/:productTypeId", productTypeMiddleware.updateProductTypeMiddleware, productTypeController.updateProductTypeById)

router.delete("/productTypes/:productTypeId", productTypeMiddleware.deleteProductTypeMiddleware, productTypeController.deleteProductTypeById)

module.exports = router;