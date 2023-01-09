// Khai báo thư viện mongo
const mongoose = require("mongoose")

//Khai báo class Schema
const Schema = mongoose.Schema

//Khởi tạo instance productTypeSchema 
const productTypeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
}, {
    //Lưu dấu bảng ghi được cập nhật vào thời gian nào
    timestamps: true
})

// Biên dịch một Book Model từ bookscheme
module.exports = mongoose.model("ProductType", productTypeSchema)