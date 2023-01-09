// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module ProductType Model
const productTypeModel = require("../models/productTypeModel");

const getAllProductType = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    productTypeModel.find((error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get all ProductType successfully",
            data: data
        })
    })
}

const createProductType = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body;
    console.log(body);
    // _id: ObjectID,
    // name: String, unique, require
    // description: String

    // B2: Validate dữ liệu
    // Kiểm tra name có hợp lệ hay không
    if (!body.name) {
        return response.status(400).json({
            status: "Bad Request",
            message: "name không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newProductType = {
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        description: body.description,
    }

    productTypeModel.create(newProductType, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(201).json({
            status: "Create ProductType successfully",
            data: data
        })
    })
}

const getProductTypeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productTypeId = request.params.productTypeId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(productTypeId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productTypeID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    productTypeModel.findById(productTypeId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get detail ProductType successfully",
            data: data
        })
    })
}

const updateProductTypeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productTypeId = request.params.productTypeId;
    const body = request.body;

    // B2: Validate dữ liệu
    //Validate Id
    if (!mongoose.Types.ObjectId.isValid(productTypeId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productTypeID không hợp lệ"
        })
    }

    if (body.name !== undefined && body.name.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "name không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const updateProductType = {}

    if (body.name !== undefined) {
        updateProductType.name = body.name
    }

    if (body.description !== undefined) {
        updateProductType.description = body.description
    }

    productTypeModel.findByIdAndUpdate(productTypeId, updateProductType, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Update ProductType successfully",
            data: data
        })
    })
}

const deleteProductTypeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productTypeId = request.params.productTypeId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(productTypeId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productTypeID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    productTypeModel.findByIdAndDelete(productTypeId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Delete ProductType successfully"
        })
    })
}

module.exports = {
    getAllProductType,
    createProductType,
    getProductTypeById,
    updateProductTypeById,
    deleteProductTypeById
}