// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Order Model
const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const orderDetailModel = require("../models/orderDetailModel");


//Get All Order
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

        console.log("GEt All Order")
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

//Get all order of custoemr
const getAllOrderOfCustomer = async (request, response) => {
    try {
        const customerId = request.params.customerId;
        // B1: Prepare data
        let { limit, page, condition, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'asc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'desc' ? 1 : -1 };
        // condition = condition ? JSON.parse(condition) : {};

        const customer = await customerModel
            .findById(customerId)
            .populate('orders')
            // .and([condition])
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();

        if (!customer) {
            return response.status(404).json({
                status: 'Not found',
                message: 'Khách hàng không tồn tại',
            });
        }
        const orders = await customer.orders
        const totalCount = await orders.length
        return response.status(200).json({
            status: 'Get all orders of customer success',
            data: orders,
            totalCount: totalCount
        });
    } catch (error) {
        return response.status(500).json({
            status: 'Error server',
            message: error.message,
        });
    }
};

//create Order
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

//Create Order Of Customer
const createOrderOfCustomer = async (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const { shippedDate, note, cost } = request.body
    // B2: Validate 
    // Validate the data
    const { error } = await validateOrder(customerId, shippedDate, cost);
    if (error) {
        return response.status(400).json({
            status: "Bad Request",
            message: error
        })
    }


    //B4: Tạo order V2
    try {
        // Create the order in the database
        const customer = await customerModel.findById(customerId)
        // B3: Tạo một order mới
        const newOrder = {
            _id: mongoose.Types.ObjectId(),
            shippedDate: shippedDate,
            note: note,
            status: "waiting",
            cost: 0,
            address: customer.address,
            phone: customer.phone,
            customer: customer
        }

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

};

//Validate Order
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

//Get Order By Id
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
            status: "Get Order by Id successfully",
            data: data
        })
    })
}

//Update Order By Id
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

    // B3: Gọi Model tạo dữ liệu
    const updateOrder = {}

    if (body.orderCode !== undefined) {
        updateOrder.orderCode = body.orderCode
    }

    if (body.note !== undefined) {
        updateOrder.note = body.note
    }

    if (body.shippedDate !== undefined) {
        updateOrder.shippedDate = body.shippedDate
    }
    if (body.status !== undefined) {
        updateOrder.status = body.status
    }
    if (body.address !== undefined) {
        updateOrder.address = body.address
    }
    if (body.phone !== undefined) {
        updateOrder.phone = body.phone
    }
    if (body.customer !== undefined) {
        updateOrder.customer = body.customer
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

// //Delete Order By Id
// const deleteOrderById = (request, response) => {
//     // B1: Chuẩn bị dữ liệu
//     const orderId = request.params.orderId;

//     // B2: Validate dữ liệu
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//         return response.status(400).json({
//             status: "Bad Request",
//             message: "orderID không hợp lệ"
//         })
//     }

//     // B3: Gọi Model tạo dữ liệu
//     orderModel.findByIdAndDelete(orderId, (error, data) => {
//         if (error) {
//             return response.status(500).json({
//                 status: "Internal server error",
//                 message: error.message
//             })
//         }

//         return response.status(200).json({
//             status: "Delete Order successfully"
//         })
//     })
// }

//Delete order By Id
const deleteOrderById = async (request, response) => {
    const orderId = request.params.orderId;

    // Kiểm tra orderId có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderID không hợp lệ"
        });
    }

    try {
        // Tìm order bằng orderId
        const order = await orderModel.findById(orderId);

        // Lấy danh sách các orderDetail của order và xóa chúng
        const orderDetails = order.orderDetails;
        await Promise.all(
            orderDetails.map(async (orderDetailId) => {
                await orderDetailModel.findByIdAndDelete(orderDetailId);
            }))

        // Xóa order
        await orderModel.findByIdAndDelete(orderId);

        // Trả về client
        return response.status(200).json({
            status: "Delete Order successfully"
        });

    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình xóa
        return response.status(500).json({
            status: "Internal server error",
            message: error.message
        });
    }
};

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