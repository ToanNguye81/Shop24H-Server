// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Customer Model
const customerModel = require("../models/customerModel");

const createCustomer = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body;

    // B2: Validate dữ liệu
    // Kiểm tra lastName có hợp lệ hay không
    if (!body.lastName.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "lastName không hợp lệ"
        })
    }
    // Kiểm tra firstName có hợp lệ hay không
    if (!body.firstName.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "firstName không hợp lệ"
        })
    }
    //Kiểm tra email có hợp lệ không
    if (!body.email.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }
    //Kiểm tra address có hợp lệ không
    if (!body.address.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }
    //Kiểm tra country có hợp lệ không
    if (!body.country.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "country không hợp lệ"
        })
    }
    //Kiểm tra city có hợp lệ không
    if (!body.city.trim()) {
        return response.status(400).json({
            status: "Bad Request",
            message: "city không hợp lệ"
        })
    }
    //Kiểm tra orders có hợp lệ không
    if (body.orders !== undefined && !mongoose.Types.ObjectId.isValid(body.orders)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "orders không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newCustomer = {
        _id: mongoose.Types.ObjectId(),
        lastName: body.lastName,
        firstName: body.firstName,
        country: body.country,
        city: body.city,
        phone: body.phone,
        email: body.email,
        address: body.address,
        // orders: body.orders,
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


// const getAllCustomer = (request, response) => {
//     // B1: Chuẩn bị dữ liệu
//     let limit = request.query.limit;
//     let page = request.query.page;
//     let skip = limit * page

//     // B2: Validate dữ liệu
//     // B3: Gọi Model tạo dữ liệu
//     customerModel
//         .find()
//         .skip(skip)
//         .limit(limit)
//         .exec((error, data) => {
//             if (error) {
//                 return response.status(500).json({
//                     status: "Internal server error",
//                     message: error.message
//                 })
//             }

//             return response.status(200).json({
//                 status: "Get all Customer successfully",
//                 data: data
//             })
//         })
// }

const getAllCustomer = async (request, response) => {
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
        const data = await customerModel
            .find(condition)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();

        // B3: Get total count
        const totalCount = await customerModel.countDocuments(condition);
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

    if (body.lastName !== undefined && body.lastName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "lastName không hợp lệ"
        })
    }

    if (body.phone !== undefined && body.phone.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "phone không hợp lệ"
        })
    }
    if (body.firstName !== undefined && body.firstName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "firstName không hợp lệ"
        })
    }

    if (body.email !== undefined && body.email.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "email không hợp lệ"
        })
    }

    if (body.country !== undefined && body.country.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "country không hợp lệ"
        })
    }

    if (body.city !== undefined && body.city.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "city không hợp lệ"
        })
    }

    if (body.address !== undefined && body.address.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }

    if (body.orders !== undefined && !mongoose.Types.ObjectId.isValid(body.orders)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "address không hợp lệ"
        })
    }

    // B3: Gọi Model update dữ liệu
    const updateCustomer = {}

    if (body.lastName !== undefined) {
        updateCustomer.lastName = body.lastName
    }

    if (body.firstName !== undefined) {
        updateCustomer.firstName = body.firstName
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