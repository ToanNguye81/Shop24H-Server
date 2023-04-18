const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//Xác thực với fireBase accessToken
const authFireBase = async (req, res, next) => {
    // ver 2
    try {
        // Get access token from Authorization header
        const authToken = req.cookies.accessToken || req.headers.authorization.split(" ")[1];

        // Verify access token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(authToken);

        // Set the user ID on the request object
        req.userId = decodedToken.uid;
        // Xác thực người dùng bằng Firebase Admin SDK
        const user = await admin.auth().getUser(decodedToken.uid);
        // Lưu thông tin người dùng vào biến req để sử dụng ở các middleware khác
        req.email = user.email;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
}

module.exports = {
    authFireBase
}