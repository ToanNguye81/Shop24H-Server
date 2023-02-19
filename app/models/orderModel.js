// Khai báo thư viện mongo
const mongoose = require("mongoose")
const crypto = require('crypto');

//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance orderSchema 
const orderSchema = new Schema({
    orderCode: {
        type: String,
        unique: true,
        default:()=>crypto.randomBytes(3).toString('hex').substr(0, 6)
    },
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
    orderDetails: [{
        type: mongoose.Types.ObjectId,
        ref: 'OrderDetail'
    }],
    cost: {
        type: Number,
        default: 0
    },
    status:{
        type: Boolean,
        default: false
    },
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})


// Biên dịch một Order Model từ orderSchema
module.exports = mongoose.model("Order", orderSchema)