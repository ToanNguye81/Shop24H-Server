// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module OrderDetail Model
const orderDetailModel = require("../models/orderDetailModel");
const orderModel = require("../models/orderModel");

const getAllOrderDetail =async (request, response) => {
    try {
        // B1: Prepare data
        let { limit, page, condition, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 10;
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

const createOrderDetailOfOrder = async (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderId = request.params.orderId;
    const { product, quantity } = request.body;
    console.log(orderId)
    console.log(request.body)

    // B2: Validate dữ liệu
    const { error } = validateOrderDetail(orderId, product, quantity);
    if (error) {
        return response.status(400).json({
            status: "Bad Request",
            message: error
        })
    }

    // B3: Thao tác với cơ sở dữ liệu
    const newOrderDetail = {
        _id: mongoose.Types.ObjectId(),
        product: product,
        quantity:quantity
    }
    //B4: Tạo orderDetail V2
    try {
        // Create the order in the database
        const createdOrderDetail = await orderDetailModel.create(newOrderDetail);

        // Add the order ID to the customer's order list
        await orderModel.findByIdAndUpdate(orderId, {
            $push: {
                orderDetails: createdOrderDetail._id
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
    // // B4 Tạo orderDetail V1
    // orderDetailModel.create(orderDetail, (error, data) => {
    //     if (error) {
    //         return response.status(500).json({
    //             status: "Internal server error",
    //             message: error.message
    //         })
    //     }
    //     // Thêm id của detailOrder mới vào mảng orderDetail của Order đã chọn
    //     orderModel.findByIdAndUpdate(orderId, {
    //         $push: {
    //             orderDetail: data._id
    //         }
    //     }, (err, updatedOrder) => {
    //         if (err) {
    //             return response.status(500).json({
    //                 status: "Internal server error",
    //                 message: err.message
    //             })
    //         }

    //         return response.status(201).json({
    //             status: "Create Order Detail Successfully",
    //             data: data
    //         })
    //     })
    // })
}


const validateOrderDetail = (pramOrderId, paramProduct, paramQuantity) => {
    const errors = {}
    // Validate pramOrderId
    if (!mongoose.Types.ObjectId.isValid(pramOrderId)) {
        errors.orderId = 'Invalid order Id';
    }

    // Validate pramOrderId
    if (!mongoose.Types.ObjectId.isValid(paramProduct)) {
        errors.product = 'Invalid product id';
    }

    // Validate paramQuantity
    if (!paramQuantity || typeof paramQuantity !== 'number' || paramQuantity < 0) {
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