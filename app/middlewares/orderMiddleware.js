const getAllOrderMiddleware = (request, response, next) => {
    console.log("Get ALL Order Middleware");
    next();
}

const createOrderMiddleware = (request, response, next) => {
    console.log("Create Order Middleware");
    next();
}

const getOrderMiddleware = (request, response, next) => {
    console.log("Get  Order Middleware");
    next();
}

const updateOrderMiddleware = (request, response, next) => {
    console.log("Update Order Middleware");
    next();
}

const deleteOrderMiddleware = (request, response, next) => {
    console.log("Delete Order Middleware");
    next();
}
const createOrderOfCustomerMiddleware=(request, response, next) => {
    console.log("Create order of Customer Middleware");
    next();
}
const getAllOrderOfCustomerMiddleware=(request, response, next) => {
    console.log("Get All of Customer Middleware");
    next();
}

module.exports = {
    getAllOrderMiddleware,
    createOrderMiddleware,
    getOrderMiddleware,
    updateOrderMiddleware,
    deleteOrderMiddleware,
    createOrderOfCustomerMiddleware,
    getAllOrderOfCustomerMiddleware

}