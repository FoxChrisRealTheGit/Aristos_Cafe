var mongoose = require("mongoose")

// Page Schema
const OrdersSchema = mongoose.Schema({
    total: {
        type: String,
    },
    shipping: {
        type: String,
    },
    userid: {
        type: String,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    status: {
        type: String
    },
    items: {
        type: Object
    }
})

const Orders = module.exports = mongoose.model("Orders", OrdersSchema);