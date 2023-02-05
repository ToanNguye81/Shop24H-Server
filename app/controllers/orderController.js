// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Order Model
const orderModel = require("../models/orderModel");
const { createCustomer } = require("./customerController");

const getAllOrder = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    orderModel.find((error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Get all Order successfully",
            data: data
        })
    })
}

const getAllOrderOfCustomer=(request, response)=>{

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

    if (!email) {
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "Email are required"
        });
    }

    try {
        let customer = await customerModel.findOne({ email });
        if (!customer) {
           await createCustomer(request,response)
        //    user = await userModel.create({
        //     _id: mongoose.Types.ObjectId(),
        //     email,
        //     firstname,
        //     lastname
        // });
        }

        await createOrder(request,response)
        

        const dice = Math.floor(Math.random() * 6 + 1);
        const diceHistory = await diceHistoryModel.create({
            _id: mongoose.Types.ObjectId(),
            customer: customer._id,
            dice
        });

        if (dice < 3) {
            return response.status(200).json({
                dice,
                prize: null,
                voucher: null
            });
        }

        const countVoucher = await voucherModel.count().exec();
        const randomVoucher = Math.floor(Math.random * countVoucher);
        const voucher = await voucherModel.findOne().skip(randomVoucher).exec();

        const voucherHistory = await voucherHistoryModel.create({
            _id: mongoose.Types.ObjectId(),
            customer: customer._id,
            voucher: voucher._id
        });
  
    } catch (error) {
    return response.status(500).json({
        status: "Error 500: Internal server error",
        message: error.message
    });
}
  };

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


    if (body.phanTramGiamGia !== undefined && (isNaN(body.phanTramGiamGia) || body.phanTramGiamGia < 0)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "phanTramGiamGia không hợp lệ"
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
    getAllOrderOfCustomer
}