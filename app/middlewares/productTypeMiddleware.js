const getAllProductTypeMiddleware = (request, response, next) => {
    console.log("Get ALL ProductType Middleware");
    next();
}

const createProductTypeMiddleware = (request, response, next) => {
    console.log("Create ProductType Middleware");
    next();
}

const getProductTypeMiddleware = (request, response, next) => {
    console.log("Get Detail ProductType Middleware");
    next();
}

const updateProductTypeMiddleware = (request, response, next) => {
    console.log("Update ProductType Middleware");
    next();
}

const deleteProductTypeMiddleware = (request, response, next) => {
    console.log("Delete ProductType Middleware");
    next();
}

module.exports = {
    getAllProductTypeMiddleware,
    createProductTypeMiddleware,
    getProductTypeMiddleware,
    updateProductTypeMiddleware,
    deleteProductTypeMiddleware
}