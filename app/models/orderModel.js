// Khai báo thư viện mongo
const mongoose = require("mongoose")

//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance orderSchema 
const orderSchema = new Schema({
    orderDate: {
        type: Date,
        default: Date.now()
    },
    shippedDate: {
        type: Date,
        require: false
    },
    note: {
        type: String,
        require: false
    },
    orderDetails: {
        type: mongoose.Types.ObjectId,
        ref: "OrderDetail"
    },
    cost: {
        type: Number,
        default: 0
    },
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})

// Biên dịch một Book Model từ bookscheme
module.exports = mongoose.model("Order", orderSchema)