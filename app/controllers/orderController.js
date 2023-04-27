// Import thư viện Mongoose
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const validator = require('validator');


// Import Module Order Model
const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const orderDetailModel = require("../models/orderDetailModel");
const productModel = require("../models/productModel");

//Get All Order
const getAllOrder = async (request, response) => {
    try {
        // B1: Prepare data
        let { limit, page, searchQuery, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const regexQuery = { $regex: typeof searchQuery.trim() === 'string' ? searchQuery.trim() : '', $options: 'i' };

        const condition = {
            $or: [
                { orderCode: regexQuery },
                { note: regexQuery },
                { status: regexQuery },
                { "customer.phone": regexQuery },
                { "customer.address": regexQuery },
                { "customer.country": regexQuery },
                { "customer.city": regexQuery },
                { "customer.email": regexQuery }
            ]
        };

        if (!isNaN(searchQuery.trim()) && searchQuery.trim()) {
            condition.$or.push(
                { cost: parseInt(searchQuery.trim()) }
            )
        }

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
        let { limit, page, searchQuery, sortBy, sortOrder } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const regexQuery = { $regex: typeof searchQuery.trim() === 'string' ? searchQuery.trim() : '', $options: 'i' };

        const fields = [
            "orderCode",
            "note",
            "status",
        ];

        const condition = {
            "customer._id": ObjectId(customerId),
            $or: [
                ...fields.map((field) => ({ [field]: regexQuery })),
                { "customer.phone": regexQuery },
                { "customer.address": regexQuery },
                { "customer.country": regexQuery },
                { "customer.city": regexQuery },
                { "customer.email": regexQuery }
            ]
        };

        // B2: Call the Model to create data
        const totalCount = await orderModel.countDocuments(condition);
        const orders = await orderModel
            .find(condition)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();


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
        const { lastName, firstName, phone, email, address, city, country, _id } = customer
        // B3: Tạo một order mới
        const newOrder = {
            _id: mongoose.Types.ObjectId(),
            shippedDate: shippedDate,
            note: note,
            status: "waiting",
            cost: 0,
            customer: { _id, lastName, firstName, phone, email, address, city, country }
        }

        const createdOrder = await orderModel.create(newOrder);

        // Add the order Id to the customer's order list
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
            message: "orderId không hợp lệ"
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
            message: "orderId không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const updateOrder = {}

    if (body.note !== undefined) {
        updateOrder.note = body.note
    }

    if (body.shippedDate !== undefined) {
        updateOrder.shippedDate = body.shippedDate
    }
    if (body.status !== undefined) {
        updateOrder.status = body.status
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

//Delete order By Id
const deleteOrderById = async (request, response) => {
    const orderId = request.params.orderId;

    // Kiểm tra orderId có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orderId không hợp lệ"
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

//Create Order Of Customer
const createOrderOfCustomerVer2 = async (request, response) => {

    //B1: Prepare data from request
    const { email } = request;
    const { lastName, firstName, country, city, phone, address, cart, note } = request.body
    const fields = ["lastName", "firstName", "country", "city", "phone", "address"]

    console.log({ lastName, firstName, country, city, phone, address, cart, note, email })

    //B2: Valid data
    if (!cart || !cart.length) {
        return response.status(400).json({
            status: "Bad request",
            message: `Your cart is empty`
        })
    }

    for (const field of fields) {
        if (!request.body[field]) {
            return response.status(400).json({
                status: "Bad request",
                message: `${field} is required`
            })
        }
    }

    //Valid phone
    if (!validator.isMobilePhone(phone, 'vi-VN')) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Phone is invalid"
        });
    }

    try {
        // B3: Create-Update Customer
        let customer = {};
        const findCustomer = await customerModel.findOne({ email: email })
        if (findCustomer) {
            // B3.1: If findCustomer's email exists, update findCustomer info
            findCustomer.lastName = lastName;
            findCustomer.firstName = firstName;
            findCustomer.country = country;
            findCustomer.city = city;
            findCustomer.phone = phone;
            findCustomer.address = address;
            customer = await findCustomer.save();//Update
        }
        else {
            // B3.2: If customer does not exist, create new customer
            const newCustomer = new customerModel({
                _id: mongoose.Types.ObjectId(),
                lastName: lastName,
                firstName: firstName,
                country: country,
                city: city,
                phone: phone,
                email: email,
                address: address
            });
            customer = await customerModel.create(newCustomer);
        }


        //B4: Create Order detail
        let orderDetails = [];
        let cost = 0;

        for (const cartItem of cart) {
            const quantity = cartItem.quantity
            const product = await productModel.findById(cartItem.product._id)
            const orderDetail = await orderDetailModel.create({ product, quantity })
            orderDetails.push(orderDetail._id)
            cost = cost + product.promotionPrice * quantity
        }

        // B5: Create Order
        const newOrder = {
            _id: mongoose.Types.ObjectId(),
            note: note,
            cost: cost,
            customer: {
                _id: customer._id,
                lastName: customer.lastName,
                firstName: customer.firstName,
                country: customer.country,
                city: customer.city,
                phone: customer.phone,
                email: customer.email,
                address: customer.address
            },
            orderDetails
        }
        const createdOrder = await orderModel.create(newOrder);
        
        // B6: Return success response 
        return response.status(200).json({
            status: "Create Order Successfully",
            data: createdOrder
        });

    } catch (err) {
        return response.status(500).json({
            status: "Internal server error",
            message: err.message
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
    createOrderOfCustomerVer2,
    validateOrder
}