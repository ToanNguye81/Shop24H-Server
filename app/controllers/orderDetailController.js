// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module OrderDetail Model
const orderDetailModel = require("../models/orderDetailModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

const getAllOrderDetail = async (request, response) => {
    try {
        // B1: Prepare data
        let { limit, page, condition, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 200;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        condition = condition ? JSON.parse(condition) : {};
        console.log(condition)

        // B2: Call the Model to create data
        const totalCount = await orderDetailModel.countDocuments(condition);
        const data = await orderDetailModel
            .find(condition)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();
        console.log(data)

        // B3: Get total count
        // Return success response
        return response.status(200).json({
            status: "Get all customers successfully",
            totalCount: totalCount,
            data: data
        });
    } catch (error) {
        // Return error response
        return response.status(500).json({
            status: "Internal server error",
            message: error.message
        });
    }
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
            message: "quantity không hợp lệ"
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

//Get all order of order
const getAllOrderDetailOfOrder = async (request, response) => {
    try {
        const orderId = request.params.orderId;
        // B1: Prepare data
        let { limit, page, condition, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        condition = condition ? JSON.parse(condition) : {};

        const order = await orderModel
            .findById(orderId)
            .and([condition])
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .populate({
                path: 'orderDetails',
            })
            .exec()
        console.log(order)

        if (!order) {
            return response.status(404).json({
                status: 'Not found',
                message: 'Not found order',
            });
        }
        const orderDetails = await order.orderDetails
        const totalCount = await orderDetails.length
        return response.status(200).json({
            status: 'Get all orderDetails of Order success',
            data: orderDetails,
            totalCount: totalCount
        });
    } catch (error) {
        return response.status(500).json({
            status: 'Error server',
            message: error.message,
        });
    }
};

const createOrderDetailOfOrder = async (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderId = request.params.orderId;
    const { productId, quantity } = request.body;
    console.log(productId)
    console.log(request.body)

    // B2: Validate dữ liệu
    const { error } = validateOrderDetail(orderId, productId, quantity);
    if (error) {
        return response.status(400).json({
            status: "Bad Request",
            message: error
        })
    }

    //B4: Tạo orderDetail V2
    try {
        //Get product 
        const product = await productModel.findById(productId)


        // B3: Thao tác với cơ sở dữ liệu
        const newOrderDetail = {
            _id: mongoose.Types.ObjectId(),
            product: product,
            quantity: quantity
        }
        console.log(newOrderDetail)

        // Create the order in the database
        const createdOrderDetail = await orderDetailModel.create(newOrderDetail);

        // Add the order ID to the order's order list
        await orderModel.findByIdAndUpdate(orderId, {
            $push: {
                orderDetails: createdOrderDetail
            },
            $inc: {
                cost: product.promotionPrice * quantity
            }
        }, { new: true });

        // Return success response
        return response.status(201).json({
            status: "Create Order Detail Successfully",
            data: createdOrderDetail,
        });
    } catch (err) {
        return response.status(500).json({
            status: "Internal server error",
            message: err.message
        });
    }
}


const validateOrderDetail = (orderId, productId, quantity) => {
    const errors = {}
    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        errors.orderId = 'Invalid order Id';
    }

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        errors.product = 'Invalid product id';
    }

    // Validate quantity
    if (!quantity || typeof quantity !== 'number' || quantity < 0) {
        errors.quantity = 'Invalid Quantity';
    }

    return {
        //Kiểm tra có lỗi xảy ra nếu có trả về mảng lỗi, không lỗi trả về null
        error: Object.keys(errors).length > 0 ? errors : null
    };
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