const getAllCustomerMiddleware = (request, response, next) => {
    console.log("Get ALL Customer Middleware");
    next();
}

const createCustomerMiddleware = (request, response, next) => {
    console.log("Create Customer Middleware");
    next();
}

const getCustomerMiddleware = (request, response, next) => {
    console.log("Get Customer Middleware");
    next();
}

const updateCustomerMiddleware = (request, response, next) => {
    console.log("Update Customer Middleware");
    next();
}

const deleteCustomerMiddleware = (request, response, next) => {
    console.log("Delete Customer Middleware");
    next();
}

module.exports = {
    getAllCustomerMiddleware,
    createCustomerMiddleware,
    getCustomerMiddleware,
    updateCustomerMiddleware,
    deleteCustomerMiddleware
}