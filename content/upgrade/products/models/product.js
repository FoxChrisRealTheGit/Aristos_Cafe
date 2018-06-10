var mongoose = require("mongoose")

// Page Schema
const ProductSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        type: String
    },
    content:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    description:{
        type: String
    },
    keywords:{
        type: String
    },
    author:{
        type: String
    },
    sorting:{
        type: Number
    },
    color:[{
        type: String
    }],
    sizes:[{
        type: String
    }],
    printfile:{
        type: String
    },
    productType:{
        type: String
    }
})

const Product = module.exports = mongoose.model("Product", ProductSchema);