
// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import customer middleware
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/auth",
    authMiddleware.authMiddleware,
    (req, res) => {
        // handle protected route here
        console.log("Xác thực thành công")
    })

router.post("/auth",
    authMiddleware.authMiddleware,
    (req, res) => {
        // handle protected route here
        console.log("Xác thực thành công")
    })

module.exports = router;