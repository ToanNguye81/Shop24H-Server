// Khai báo thư viện mongo
const mongoose = require("mongoose")

//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance orderDetailSchema 
const orderDetailSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 0
    }
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})

// Biên dịch một Book Model từ bookscheme
module.exports = mongoose.model("OrderDetail", orderDetailSchema)