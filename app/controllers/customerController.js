// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Customer Model
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");

//Create Customer
const createCustomer = async (request, response) => {
    // B1: Prepare data
    const { lastName, firstName, country, city, phone, email, address } = request.body;
    const fields = ['lastName', 'firstName', 'country', 'city', 'email', 'address'];

    // B2: Valid data Version 2 - not null and phone
    if (!(phone !== undefined && phone.trim().length === 10 && !isNaN(phone.trim()))) {
        return response.status(400).json({
            status: "Bad Request",
            message: "Phone không hợp lệ"
        });
    }

    // check not null
    for (const field of fields) {
        if (!request.body[field].trim()) {
            return response.status(400).json({
                status: "Bad Request",
                message: `${field} is invalid`
            });
        }
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
            message: error.message
        })
    }
}

//Get All Customer
const getAllCustomer = async (request, response) => {
    console.log(request.query)
    try {
        // B1: Prepare data
        let { limit, page, sortBy, sortOrder, searchQuery } = request.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'asc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'desc' ? 1 : -1 };

        
        //create searchCondition, toLowerCase
        const fields = Object.keys(customerModel.schema.paths).filter((field) => ["lastName","firstName","phone","email","address","city","country"].includes(field));
        const condition = fields.map((field) => ({
            [field]: { $regex: searchQuery, $options: "i" },
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
            message: error.message
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
            message: "customerID không hợp lệ"
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
        console.log(data)
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
const updateCustomerById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const customerId = request.params.customerId;
    const { lastName, firstName, country, city, phone, email, address } = request.body;
    const fields = ['lastName', 'firstName', 'email', 'address', 'phone'];

    // B2: Validate data
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerID is invalid"
        })
    }

    if (lastName !== undefined && lastName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "lastName không hợp lệ"
        })
    }

    if (phone !== undefined && (phone.trim().length !== 10 || isNaN(phone.trim()))) {
        return response.status(400).json({
            status: "Bad Request",
            message: "phone không hợp lệ update"
        });
    }

    if (firstName !== undefined && firstName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "firstName không hợp lệ"
        })
    }

    if (email !== undefined && email.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    if (country !== undefined && country.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "country không hợp lệ"
        })
    }

    if (city !== undefined && city.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "city không hợp lệ"
        })
    }

    if (address !== undefined && address.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }

    // B3: Gọi Model update dữ liệu
    const updateCustomer = {}

    if (lastName !== undefined) {
        updateCustomer.lastName = lastName
    }

    if (firstName !== undefined) {
        updateCustomer.firstName = firstName
    }

    if (email !== undefined) {
        updateCustomer.email = email
    }

    if (address !== undefined) {
        updateCustomer.address = address
    }

    if (phone !== undefined) {
        updateCustomer.phone = phone
    }

    //Fin By Id and Update
    customerModel.findByIdAndUpdate(customerId, updateCustomer, { new: true }, (error, data) => {
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

// //Delete customer By Id
const deleteCustomerById = async (request, response) => {
    const customerId = request.params.customerId;

    // Kiểm tra customerId có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "customerID không hợp lệ"
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