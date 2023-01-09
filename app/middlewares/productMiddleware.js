const getAllProductMiddleware = (request, response, next) => {
    console.log("Get ALL Product Middleware");
    next();
}

const createProductMiddleware = (request, response, next) => {
    console.log("Create Product Middleware");
    next();
}

const getProductMiddleware = (request, response, next) => {
    console.log("Get Product Middleware");
    next();
}

const updateProductMiddleware = (request, response, next) => {
    console.log("Update Product Middleware");
    next();
}

const deleteProductMiddleware = (request, response, next) => {
    console.log("Delete Product Middleware");
    next();
}

module.exports = {
    getAllProductMiddleware,
    createProductMiddleware,
    getProductMiddleware,
    updateProductMiddleware,
    deleteProductMiddleware
}