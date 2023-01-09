// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Customer Model
const customerModel = require("../models/customerModel");

const getAllCustomer = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    customerModel.find((error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get all Customer successfully",
            data: data
        })
    })
}

const createCustomer = (request, response) => {
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
    const newCustomer = {
        _id: mongoose.Types.ObjectId(),
        fullName: body.fullName,
        email: body.email,
        address: body.address,
        phone: body.phone,
        orders: body.orders,
    }

    customerModel.create(newCustomer, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(201).json({
            status: "Create Customer successfully",
            data: data
        })
    })
}

const getCustomerById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    customerModel.findById(customerId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get detail Customer successfully",
            data: data
        })
    })
}

const updateCustomerById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerID không hợp lệ"
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
    const updateCustomer = {}

    if (body.fullName !== undefined) {
        updateCustomer.fullName = body.fullName
    }

    if (body.email !== undefined) {
        updateCustomer.email = body.email
    }

    if (body.address !== undefined) {
        updateCustomer.address = body.address
    }

    if (body.phone !== undefined) {
        updateCustomer.phone = body.phone
    }

    if (body.orders !== undefined) {
        updateCustomer.orders = body.orders
    }

    customerModel.findByIdAndUpdate(customerId, updateCustomer, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Update Customer successfully",
            data: data
        })
    })
}

const deleteCustomerById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    customerModel.findByIdAndDelete(customerId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Delete Customer successfully"
        })
    })
}

module.exports = {
    getAllCustomer,
    createCustomer,
    getCustomerById,
    updateCustomerById,
    deleteCustomerById
}