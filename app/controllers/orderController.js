// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Order Model
const orderModel = require("../models/orderModel");
const { createCustomer } = require("./customerController");

const getAllOrder = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    orderModel.find((error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get all Order successfully",
            data: data
        })
    })
}

const getAllOrderOfCustomer = (request, response) => {

}

const createOrder = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body;

    // B2: Validate dữ liệu
    // Kiểm tra orderCode có hợp lệ hay không
    if (!body.orderCode) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderCode không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newOrder = {
        _id: mongoose.Types.ObjectId(),
    }

    orderModel.create(newOrder, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(201).json({
            status: "Create Order successfully",
            data: data
        })
    })
}

const createOrderOfCustomer = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const body = request.body;
   /*orderCode: {type: String,required: true,unique: true
     orderDate: {type: Date,default: Date.now()
     shippedDate: {type: Date,require: false
     note: {type: String,require: false
     orderDetails: [{type: mongoose.Types.ObjectId,ref: 'OrderDetail'
     cost: {type: Number,default: 0
    */
    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderDetail)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Product không hợp lệ"
        })
    }

    if (!(Number.isInteger(body.cost) && body.cost >= 0)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Quantity không hợp lệ"
        })
    }

    // B3: Thao tác với cơ sở dữ liệu
    const orderDetail = {
        _id: mongoose.Types.ObjectId(),
        product: body.product,
        cost: body.cost
    }

    orderDetailModel.create(orderDetail, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        // Thêm ID của detailOrder mới vào mảng orderDetail của Order đã chọn
        orderModel.findByIdAndUpdate(customerId, {
            $push: {
                orderDetail: data._id
            }
        }, (err, updatedOrder) => {
            if (err) {
                return response.status(500).json({
                    status: "Internal server error",
                    message: err.message
                })
            }

            return response.status(201).json({
                status: "Create Order Detail Successfully",
                data: data
            })
        })
    })
};

const getOrderById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderModel.findById(customerId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get detail Order successfully",
            data: data
        })
    })
}

const updateOrderById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        })
    }

    if (body.orderCode !== undefined && body.orderCode.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderCode không hợp lệ"
        })
    }


    if (body.phanTramGiamGia !== undefined && (isNaN(body.phanTramGiamGia) || body.phanTramGiamGia < 0)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "phanTramGiamGia không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const updateOrder = {}

    if (body.orderCode !== undefined) {
        updateOrder.orderCode = body.orderCode
    }

    if (body.phanTramGiamGia !== undefined) {
        updateOrder.phanTramGiamGia = body.phanTramGiamGia
    }

    orderModel.findByIdAndUpdate(customerId, updateOrder, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Update Order successfully",
            data: data
        })
    })
}

const deleteOrderById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderModel.findByIdAndDelete(customerId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Delete Order successfully"
        })
    })
}

module.exports = {
    getAllOrder,
    createOrder,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    createOrderOfCustomer,
    getAllOrderOfCustomer
}