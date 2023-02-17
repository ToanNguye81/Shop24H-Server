// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Order Model
const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");

const getAllOrder = async (request, response) => {
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
        const totalCount = await orderModel.countDocuments(condition);
        const data = await orderModel
            .find(condition)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();

        // B3: Get total count
        // Return success response
        return response.status(200).json({
            status: "Get all orders successfully",
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

const createOrderOfCustomer = async (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const { shippedDate, note, cost,orderDetails } = request.body
    console.log(request.body)
    // B2: Validate 
    // Validate the data
    const { error } = await validateOrder(customerId, shippedDate, cost);
    console.log(error)
    if (error) {
        return response.status(400).json({
            status: "Bad Request",
            message: error
        })
    }

    // B3: Tạo một order mới
    const newOrder = {
        _id: mongoose.Types.ObjectId(),
        shippedDate: shippedDate,
        note: note,
        cost: cost,
    }

    //B4: Tạo order V2
    try {
        // Create the order in the database
        const createdOrder = await orderModel.create(newOrder);

        // Add the order ID to the customer's order list
        await customerModel.findByIdAndUpdate(customerId, {
            $push: {
                orders: createdOrder._id
            }
        }, { new: true });

        // Return success response
        return response.status(201).json({
            status: "Create Order Successfully",
            data: createdOrder,
        });
    } catch (err) {
        return response.status(500).json({
            status: "Internal server error",
            message: err.message
        });
    }
    // B4: Tạo Order V1
    // orderModel.create(newOrder, (error, data) => {
    //     if (error) {
    //         return response.status(500).json({
    //             status: "Internal server error",
    //             message: error.message
    //         })
    //     }
    //     // Thêm id của Order mới vào mảng Customer của Customer đã chọn
    //     customerModel.findByIdAndUpdate(customerId, {
    //         $push: {
    //             order: data._id
    //         }
    //     }, (err, updatedOrder) => {
    //         if (err) {
    //             return response.status(500).json({
    //                 status: "Internal server error",
    //                 message: err.message
    //             })
    //         }

    //         return response.status(201).json({
    //             status: "Create Order  Successfully",
    //             data: data
    //         })
    //     })
    // })

};

const validateOrder = (customerId, shippedDate, cost) => {
    const errors = {};
    // Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        errors.customerId = 'Invalid customer Id';
    }

    // Validate shippedDate
    if (shippedDate && !Date.parse(shippedDate)) {
        errors.shippedDate = 'Invalid shipped date';
    }

    // Validate cost
    if (cost !== undefined && typeof cost !== 'number') {
        errors.cost = 'Invalid cost';
    }

    return {
        //Kiểm tra có lỗi xảy ra nếu có trả về mảng lỗi, không lỗi trả về null
        error: Object.keys(errors).length > 0 ? errors : null
    };
}

const getOrderById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const orderId = request.params.orderId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderModel.findById(orderId, (error, data) => {
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
    const orderId = request.params.orderId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
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



    // B3: Gọi Model tạo dữ liệu
    const updateOrder = {}

    if (body.orderCode !== undefined) {
        updateOrder.orderCode = body.orderCode
    }

    if (body.phanTramGiamGia !== undefined) {
        updateOrder.phanTramGiamGia = body.phanTramGiamGia
    }

    orderModel.findByIdAndUpdate(orderId, updateOrder, (error, data) => {
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
    const orderId = request.params.orderId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    orderModel.findByIdAndDelete(orderId, (error, data) => {
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
    getAllOrderOfCustomer,
    validateOrder
}