const { response } = require("express");

const getAllOrderDetailMiddleware = (request, response, next) => {
    console.log("Get ALL OrderDetail Middleware");
    next();
}

const createOrderDetailMiddleware = (request, response, next) => {
    console.log("Create OrderDetail Middleware");
    next();
}

const getOrderDetailMiddleware = (request, response, next) => {
    console.log("Get OrderDetail Middleware");
    next();
}

const updateOrderDetailMiddleware = (request, response, next) => {
    console.log("Update OrderDetail Middleware");
    next();
}

const deleteOrderDetailMiddleware = (request, response, next) => {
    console.log("Delete OrderDetail Middleware");
    next();
}
const getAllOrderDetailOfOrderMiddleware = (request, response, next) => {
    console.log("getAll Order Detail Of Order Middleware")
    next();
}
const createOrderDetailOfOrderMiddleware = (request, response, next) => {
    console.log("create Order Detail Of Order Middleware")
    next();
}
module.exports = {
    getAllOrderDetailMiddleware,
    createOrderDetailMiddleware,
    getOrderDetailMiddleware,
    updateOrderDetailMiddleware,
    deleteOrderDetailMiddleware,
    createOrderDetailOfOrderMiddleware,
    getAllOrderDetailOfOrderMiddleware

}