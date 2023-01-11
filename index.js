// Khai báo thư viện Express
const express = require("express");
const cors=require("cors")
// khai báo mongoose 
var mongoose = require('mongoose');

// Khởi tạo Express App
const app = express();

// Cấu hình request đọc được body json
app.use(express.json());
app .use(cors())
// Khai báo để dử dụng UTF8
app.use(express.urlencoded({
    extended: true
}))

//Khai báo port sử dụng
const port = 8000;

// Kết nối với MongoDB:
mongoose.connect("mongodb://127.0.0.1:27017/CRUD_Shop24h", function(error) {
    if (error) throw error;
    console.log('Successfully MongoDB connected');
})


// Khai báo router app
const productTypeRouter = require("./app/routers/productTypeRouter");
const productRouter = require("./app/routers/productRouter");
const customerRouter = require("./app/routers/customerRouter");
const orderRouter = require("./app/routers/orderRouter");
const orderDetailRouter = require("./app/routers/orderDetailRouter");


// App sử dụng router
app.use("/", productTypeRouter);
app.use("/", productRouter);
app.use("/", orderRouter);
app.use("/", customerRouter);
app.use("/", orderDetailRouter);


app.listen(port, () => {
    console.log(`App Listening on port ${port}`);
})