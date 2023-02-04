const mongoose = require("mongoose")

const Schema = mongoose.Schema

//Khởi tạo instance reviewSchema 
const customerSchema = new Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "Order"
    }],
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})

// Biên dịch một Customer Model từ customerSchema
module.exports = mongoose.model("Customer", customerSchema)