// Khai báo thư viện mongo
const mongoose = require("mongoose")

//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance productSchema 
const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: false
    },
    // type: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "ProductType",
    //     required: true
    // },
     type: {
        type:String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    buyPrice: {
        type: Number,
        required: true
    },
    promotionPrice: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    is_in_inventory: {
        type: Boolean,
        require: true,
    }, amount: {
        type: Number,
        default: 0
    }
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true,
})

// Biên dịch một Book Model từ bookscheme
module.exports = mongoose.model("Product", productSchema)