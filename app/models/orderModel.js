// Khai báo thư viện mongo
const mongoose = require("mongoose")
const crypto = require('crypto');
// const moment = require('moment');


//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance orderSchema 
const orderSchema = new Schema({
    orderCode: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(3).toString('hex').substr(0, 6).toLocaleUpperCase()
    },
    orderDate: {
        type: Date,
        default: Date.now(),
        // get: function (date) {
        //     return moment(date).format('DD-MM-YYYY');
        // }
    },
    shippedDate: {
        type: Date,
        default: Date.now(),
        // get: function (date) {
        //     return moment(date).format('DD-MM-YYYY');
        // }
        // require: false
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
    status: {
        type: String,
        enum: ['waiting', 'delivery', 'success'],
        default: 'waiting'
    },
    customer: {
        type: Object,
        require: true
    },
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})


// Biên dịch một Order Model từ orderSchema
module.exports = mongoose.model("Order", orderSchema)