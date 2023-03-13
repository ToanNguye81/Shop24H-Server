const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const authMiddleware = async (req, res, next) => {
    console.log("Start authMiddleware")
    // ver 2
    try {
        // Get access token from Authorization header
        const authToken = req.cookies.accessToken || req.headers.authorization.split(" ")[1];

        // Verify access token using Firebase Admin SDK
        /* Phương thức verifyIdToken() sẽ xác thực tính hợp lệ của access token 
        bằng cách kiểm tra chữ ký số, thời gian hết hạn và các tính năng khác của
        JWT. Vì vậy, dù không có lệnh cụ thể để tạo JWT trong đoạn mã này, nhưng
        nó vẫn sử dụng JWT để xác thực tính hợp lệ của access token.
        */
       const decodedToken = await admin.auth().verifyIdToken(authToken);

        // Set the user ID on the request object
        req.userId = decodedToken.uid;
        // Xác thực người dùng bằng Firebase Admin SDK
        const user = await admin.auth().getUser(decodedToken.uid);
        console.log(user)
        // Lưu thông tin người dùng vào biến req để sử dụng ở các middleware khác
        req.userAuth = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
}

module.exports = { authMiddleware };