// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module OrderDetail Model
const orderDetailModel = require("../models/orderDetailModel");

const getAllOrderDetail = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    orderDetailModel.find((error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get all OrderDetail successfully",
            data: data
        })
    })
}

const createOrderDetail = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body;
    // {
    // fullName: String, required
    // email: String, required, unique
    // address: String, required
    // phone: String, required, unique
    // orders: Array[ObjectID], ref: Order
    // }

    // B2: Validate dữ liệu
    // Kiểm tra fullName có hợp lệ hay không
    if (!body.fullName) {
        return response.status(400).json({
            status: "Bad Request",
            message: "fullName không hợp lệ"
        })
    }

    //Kiểm tra email có hợp lệ không
    if (!body.email) {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    //Kiểm tra address có hợp lệ không
    if (!body.address) {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }

    //Kiểm tra phone có hợp lệ không
    if (!body.phone) {
        return response.status(400).json({
            status: "Bad Request",
            message: "phone không hợp lệ"
        })
    }

    //Kiểm tra orders có hợp lệ không
    if (!body.orders) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orders không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newOrderDetail = {
        _id: mongoose.Types.ObjectId(),
        fullName: body.fullName,
        email: body.email,
        address: body.address,
        phone: body.phone,
        orders: body.orders,
    }

    orderDetailModel.create(newOrderDetail, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(201).json({
            status: "Create OrderDetail successfully",
            data: data
        })
    })
}

const getOrderDetailById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderDetailId = request.params.orderDetailId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderDetailID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderDetailModel.findById(orderDetailId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get detail OrderDetail successfully",
            data: data
        })
    })
}

const updateOrderDetailById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderDetailId = request.params.orderDetailId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderDetailID không hợp lệ"
        })
    }

    if (body.fullName !== undefined && body.fullName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "fullName không hợp lệ"
        })
    }

    if (body.email !== undefined && body.email.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    if (body.address !== undefined && body.address.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }

    if (body.phone !== undefined && body.phone.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "phone không hợp lệ"
        })
    }

    if (body.orders !== undefined && body.orders.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "orders không hợp lệ"
        })
    }

    // B3: Gọi Model update dữ liệu
    const updateOrderDetail = {}

    if (body.fullName !== undefined) {
        updateOrderDetail.fullName = body.fullName
    }

    if (body.email !== undefined) {
        updateOrderDetail.email = body.email
    }

    if (body.address !== undefined) {
        updateOrderDetail.address = body.address
    }

    if (body.phone !== undefined) {
        updateOrderDetail.phone = body.phone
    }

    if (body.orders !== undefined) {
        updateOrderDetail.orders = body.orders
    }

    orderDetailModel.findByIdAndUpdate(orderDetailId, updateOrderDetail, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Update OrderDetail successfully",
            data: data
        })
    })
}

const deleteOrderDetailById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderDetailId = request.params.orderDetailId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderDetailID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderDetailModel.findByIdAndDelete(orderDetailId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Delete OrderDetail successfully"
        })
    })
}

module.exports = {
    getAllOrderDetail,
    createOrderDetail,
    getOrderDetailById,
    updateOrderDetailById,
    deleteOrderDetailById
}