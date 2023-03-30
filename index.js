  // Khai báo thư viện Express
  const express = require("express");
  const cors = require("cors")
  const cookieParser = require('cookie-parser')
  // khai báo mongoose 
  var mongoose = require('mongoose');
  const dotenv = require('dotenv');

  //Set giá trị mongosee
  // mongoose.set('strictQuery', false);
  // Khai báo router app
  const productRouter = require("./app/routers/productRouter");
  const customerRouter = require("./app/routers/customerRouter");
  const orderRouter = require("./app/routers/orderRouter");
  const orderDetailRouter = require("./app/routers/orderDetailRouter");
  const userRouter = require("./app/routers/userRouter");

  dotenv.config();

  // Khởi tạo Express App
  const app = express();
  //Khai báo port sử dụng
  const port = process.env.PORT || 8000;

  // Cấu hình request đọc được body json
  app.use(express.json());
  // app.use(cors())
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }));

  // Cấu hình request đọc được cookies
  app.use(cookieParser())
  // Khai báo để dử dụng UTF8
  app.use(express.urlencoded({ extended: true }))

  mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully MongoDB connected');
    }
  });

  // App sử dụng router
  //Express cho phép tối đa 5 middleware được thực hiện trong mỗi request. nên nếu có Middleware thứ 6 sẽ bị lỗ
  app.use("/", productRouter);
  app.use("/", orderDetailRouter);
  app.use("/", orderRouter);
  app.use("/", customerRouter);
  app.use("/", userRouter);


  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });


