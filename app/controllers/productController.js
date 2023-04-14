// Import thư viện Mongoose
const mongoose = require("mongoose");

// Import Module Product Model
const productModel = require("../models/productModel");

//Get all product
const getAllProduct = async (request, response) => {
    try {
        // B1: Prepare data
        let { limit, page, sortBy, sortOrder, brand, minPrice, maxPrice, gender, category } = request.query;
        console.log(request.query)
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 0;
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'asc';
        const skip = limit * page;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        
        const condition = {
            promotionPrice: { $gte: minPrice || 0, $lte: maxPrice || 100000 }
        };
        
        gender?condition.gender={$in:gender}:[]
        brand ? condition.brand = { $in: brand } : []
        category ? condition.category = {$in:category} : []


        // B2: Call the Model to create data
        const totalCount = await productModel.countDocuments(condition);
        const data = await productModel
            .find(condition)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        // B3: Get total count
        // Return success response
        return response.status(200).json({
            status: "Get all products successfully",
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

//Create Product
const createProduct = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body;

    // B2: Validate dữ liệu
    // Kiểm tra name có hợp lệ hay không
    if (!body.name) {
        return response.status(400).json({
            status: "Bad Request",
            message: "name không hợp lệ"
        })
    }

    // Kiểm tra type có hợp lệ hay không
    if (!body.type) {
        return response.status(400).json({
            status: "Bad Request",
            message: "type không hợp lệ"
        })
    }

    // Kiểm tra brand có hợp lệ hay không
    if (!body.brand) {
        return response.status(400).json({
            status: "Bad Request",
            message: "brand không hợp lệ"
        })
    }

    // Kiểm tra imageUrl có hợp lệ hay không
    if (!body.imageUrl) {
        return response.status(400).json({
            status: "Bad Request",
            message: "imageUrl không hợp lệ"
        })
    }

    // Kiểm tra buyPrice có hợp lệ hay không
    if (!body.buyPrice) {
        return response.status(400).json({
            status: "Bad Request",
            message: "buyPrice không hợp lệ"
        })
    }
    // Kiểm tra promotionPrice có hợp lệ hay không
    if (!body.promotionPrice) {
        return response.status(400).json({
            status: "Bad Request",
            message: "promotionPrice không hợp lệ"
        })
    }

    // Kiểm tra amount có hợp lệ hay không
    if (!body.amount) {
        return response.status(400).json({
            status: "Bad Request",
            message: "amount không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    const newProduct = {
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        description: body.description,
        type: body.type,
        imageUrl: body.imageUrl,
        buyPrice: body.buyPrice,
        promotionPrice: body.promotionPrice,
        amount: body.amount,
        brand: body.brand,
        amount: body.amount
    }

    productModel.create(newProduct, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(201).json({
            status: "Create Product successfully",
            data: data
        })
    })
}

//Get Product By Id
const getProductById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productId = request.params.productId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productId not validate"
        })
    }

    // B3: Gọi Model lay dữ liệu
    productModel.findById(productId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Get detail Product successfully",
            data: data
        })
    })
}

//Update Product By Id
const updateProductById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productId = request.params.productId;
    const body = request.body;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productId không hợp lệ"
        })
    }
    // B3: Valid Product data
    const errors = validProduct(body);
    if (errors) {
        return response.status(400).json({
            status: "Bad Request",
            message: errors
        });
    }
    // Step 4: Build the update fields
    const updateFields = {};
    if (body.name) { updateFields.name = body.name }
    if (body.brand) { updateFields.brand = body.brand }
    if (body.description) { updateFields.description = body.description }
    if (body.type) { updateFields.type = body.type }
    if (body.imageUrl) { updateFields.imageUrl = body.imageUrl }
    if (body.buyPrice) { updateFields.buyPrice = body.buyPrice }
    if (body.promotionPrice) { updateFields.promotionPrice = body.promotionPrice }
    if (body.amount) { updateFields.amount = body.amount }

    productModel.findByIdAndUpdate(productId, updateFields, { new: true }, (error, updatedProduct) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        if (!updatedProduct) {
            return response.status(404).json({
                status: "Not Found",
                message: "Product not found"
            });
        }

        return response.status(200).json({
            status: "Update Product successfully",
            data: updatedProduct
        })
    })
}

//Delete Product By Id
const deleteProductById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const productId = request.params.productId;

    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "productId không hợp lệ"
        })
    }

    // B3: Gọi Model tạo dữ liệu
    productModel.findByIdAndDelete(productId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }

        return response.status(200).json({
            status: "Delete Product successfully"
        })
    })
}

//Valid Product
const validProduct = (product) => {
    const { name, brand, description, type, imageUrl, buyPrice, promotionPrice, amount } = product;
    const errors = [];

    if (name && name.trim() === '') {
        errors.push({ field: 'name', message: 'Name must not be empty' });
    }
    if (brand && brand.trim() === '') {
        errors.push({ field: 'brand', message: 'Brand must not be empty' });
    }
    if (description && description.trim() === '') {
        errors.push({ field: 'description', message: 'Description must not be empty' });
    }
    if (type && type.trim() === '') {
        errors.push({ field: 'type', message: 'Type must not be empty' });
    }
    if (imageUrl && imageUrl.trim() === '') {
        errors.push({ field: 'imageUrl', message: 'Image URL must not be empty' });
    }
    if (buyPrice && (isNaN(parseFloat(buyPrice)) || parseFloat(buyPrice) <= 0)) {
        errors.push({ field: 'buyPrice', message: 'Buy price must be a number greater than 0' });
    }
    if (promotionPrice && (isNaN(parseFloat(promotionPrice)) || parseFloat(promotionPrice) <= 0)) {
        errors.push({ field: 'promotionPrice', message: 'Promotion price must be a number greater than 0' });
    }
    if (amount && (isNaN(parseInt(amount)) || parseInt(amount) < 0)) {
        errors.push({ field: 'amount', message: 'Amount must be an integer greater than or equal to 0' });
    }
    return errors.length ? errors : null;
}

module.exports = {
    getAllProduct,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById
}