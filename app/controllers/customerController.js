// Import thư viện Mongoose
const mongoose = require("mongoose");
const validator = require('validator');


// Import Module Customer Model
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");

//Create Customer
const createCustomer = async (request, response) => {
    // B1: Prepare data
    const { lastName, firstName, country, city, phone, email, address } = request.body;
    const fields = ['lastName', 'firstName', 'country', 'city', 'address', "phone", "email"];

    console.log({ lastName, firstName, country, city, phone, email, address })
    // B2: Valid data Version 2 - not null and phone
    // Check isEmpty in input fields 
    for (const field of fields) {
        if (validator.isEmpty(request.body[field])) {
            return response.status(400).json({
                status: "Bad Request",
                message: `${field} is required`
            });
        }
    }


    //Valid phone
    if (!validator.isMobilePhone(phone, 'vi-VN')) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Phone is invalid"
        });
    }

    if (!validator.isEmail(email)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Email is invalid"
        });
    }



    try {
        // B3: Check if customer with email already exists
        const customer = await customerModel.findOne({ email: email });

        
        if (customer) {
            // B4: If customer's email exists, update customer info
            customer.lastName = lastName;
            customer.firstName = firstName;
            customer.country = country;
            customer.city = city;
            customer.phone = phone;
            customer.address = address;

            const updatedCustomer = await customer.save();

            return response.status(200).json({
                status: "Update Success",
                message: "Customer updated successfully",
                data: updatedCustomer
            });
        }
        else {
            // B5: If customer does not exist, create new customer
            const newCustomer = new customerModel({
                _id: mongoose.Types.ObjectId(),
                lastName,
                firstName,
                country,
                city,
                phone,
                email,
                address
            });

            const result = await customerModel.create(newCustomer);

            return response.status(201).json({
                status: "Create customer successfully",
                data: result
            });
        }
    }
    catch (error) {
        // Return error response
        return response.status(500).json({
            status: "Internal server error",
            message: error
        })
    }
}

//Get All Customer
const getAllCustomer = async (request, response) => {
    try {
        // B1: Prepare data
        let { limit, page, sortBy, sortOrder, searchQuery } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'asc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        //create searchCondition
        const fields = ["lastName", "firstName", "phone", "email", "address", "city", "country"];
        const condition = fields.map((field) => ({
            [field]: { $regex: searchQuery.trim(), $options: "i" },
        }))

        // B2: Call the Model to create data
        const totalCount = await customerModel.countDocuments({ $or: condition });
        const data = await customerModel
            .find({ $or: condition })
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
            message: error
        });
    }
};

//Get Customer by Id
const getCustomerById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerId không hợp lệ"
        })
    }

    // B3: Gọi Model tìm dữ liệu
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

//Get Customer By Email
const getCustomerByEmail = async (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const { email } = request;
    try {
        // B2: Call the Model to create data
        const data = await customerModel.findOne({ email: email })
        // B3: Get total count
        // Return success response
        return response.status(200).json({
            status: "Get customers by Email successfully",
            data: data,
            email: email
        });
    } catch (error) {
        // Return error response
        return response.status(500).json({
            status: "Internal server error",
            message: error.message
        });
    }
}

//Update customer by Id
const updateCustomerById = async (request, response) => {
    console.log("Update customer by Id")
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const { lastName, firstName, country, city, phone, email, address } = request.body;
    const fields = ['lastName', 'firstName', 'address', "city", "country","city","phone"];

    // B2: Validate data
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerId is invalid"
        })
    }

    // Check isEmpty in input fields 
    for (const field of fields) {
        if (validator.isEmpty(request.body[field])) {
            return response.status(400).json({
                status: "Bad Request",
                message: `${field} is required`
            });
        }
    }

    //Valid phone
    if (!validator.isMobilePhone(phone, 'vi-VN')) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Phone is invalid"
        });
    }

    if (!validator.isEmail(email)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Email is invalid"
        });
    }

    // B3: Gọi Model update dữ liệu
    const updateCustomer = {};

    if (lastName) {
        updateCustomer.lastName = lastName;
    }

    if (firstName) {
        updateCustomer.firstName = firstName;
    }

    if (phone) {
        updateCustomer.phone = phone;
    }

    if (email) {
        updateCustomer.email = email;
    }

    if (address) {
        updateCustomer.address = address;
    }

    if (city) {
        updateCustomer.city = city;
    }

    if (country) {
        updateCustomer.country = country;
    }

    console.log(updateCustomer)
    //Fin By Id and Update
    try {
        const updatedCustomer = await customerModel.findByIdAndUpdate(customerId, updateCustomer, { new: true });
        if (!updatedCustomer) {
            return response.status(404).json({
                status: "Not found",
                message: "Customer not found"
            });
        }
        return response.status(200).json({
            status: "Update Customer successfully",
            data: updatedCustomer
        })

    } catch (error) {
        return response.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}

// //Delete customer By Id
const deleteCustomerById = async (request, response) => {
    const customerId = request.params.customerId;

    // Kiểm tra customerId có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerId không hợp lệ"
        });
    }

    try {
        // Tìm customer bằng customerId
        const customer = await customerModel.findById(customerId);

        // Lấy danh sách các order của customer và xóa chúng
        const orders = customer.orders;
        await Promise.all(
            orders.map(async (orderId) => {
                // Tìm order bằng orderId
                const order = await orderModel.findById(orderId);

                // Xóa tất cả order details của order
                await Promise.all(
                    order.orderDetails.map(async (orderDetailId) => {
                        await orderDetailModel.findByIdAndDelete(orderDetailId);
                    })
                );

                // Xóa order
                await orderModel.findByIdAndDelete(orderId);
            })
        );

        // Xóa customer
        await customerModel.findByIdAndDelete(customerId);

        return response.status(200).json({
            status: "Delete Customer successfully"
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
    getAllCustomer,
    createCustomer,
    getCustomerById,
    updateCustomerById,
    deleteCustomerById,
    getCustomerByEmail
}