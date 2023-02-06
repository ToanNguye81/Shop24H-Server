// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module OrderDetail Model
const orderDetailModel = require("../models/orderDetailModel");
const orderModel = require("../models/orderModel");

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
    // B2: Validate dữ liệu
    // Kiểm tra product có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(body.product)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderDetailId không hợp lệ"
        })
    }

    //Kiểm tra quantity có hợp lệ không
    if (!body.quantity) {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newOrderDetail = {
        _id: mongoose.Types.ObjectId(),
        product: body.product,
        quantity: body.email,
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
            message: "orderDetailId không hợp lệ"
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
            message: "orderDetailId không hợp lệ"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(body.product)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "product không hợp lệ"
        })
    }

    if (body.quantity !== undefined && body.quantity.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    // B3: Gọi Model update dữ liệu
    const updateOrderDetail = {}

    if (body.product !== undefined) {
        updateOrderDetail.product = body.product
    }

    if (body.quantity !== undefined) {
        updateOrderDetail.quantity = body.quantity
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
            message: "orderDetailId không hợp lệ"
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
const getAllOrderDetailOfOrder = (request, response) => {
     // B1: Chuẩn bị dữ liệu
     const orderId = request.params.orderId;

     // B2: Validate dữ liệu
     if (!mongoose.Types.ObjectId.isValid(orderId)) {
         return response.status(400).json({
             status: "Bad Request",
             message: "Course Id không hợp lệ"
         })
     }
 
     // B3: Thao tác với cơ sở dữ liệu
     orderModel.findById(orderId)
         .populate("orderDetail")
         .exec((error, data) => {
             if (error) {
                 return response.status(500).json({
                     status: "Internal server error",
                     message: error.message
                 })
             }
 
             return response.status(200).json({
                 status: "Get all detailOrder of order successfully",
                 data: data
             })
         })
}

const createOrderDetailOfOrder = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderId = request.params.orderId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Order Id không hợp lệ"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(body.product)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Product không hợp lệ"
        })
    }

    if (!(Number.isInteger(body.quantity) && body.quantity > 0)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Quantity không hợp lệ"
        })
    }

    // B3: Thao tác với cơ sở dữ liệu
    const orderDetail = {
        _id: mongoose.Types.ObjectId(),
        product: body.product,
        quantity: body.quantity
    }

    orderDetailModel.create(orderDetail, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        // Thêm id của detailOrder mới vào mảng orderDetail của Order đã chọn
        orderModel.findByIdAndUpdate(orderId, {
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
}
module.exports = {
    getAllOrderDetail,
    createOrderDetail,
    getOrderDetailById,
    updateOrderDetailById,
    deleteOrderDetailById,
    getAllOrderDetailOfOrder,
    createOrderDetailOfOrder
}