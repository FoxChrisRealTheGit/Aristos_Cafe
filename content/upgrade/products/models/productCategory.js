var mongoose = require("mongoose")

// Product Category Schema
const ProductCategorySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
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
    imagepath:{
        type: String
    }
})

const ProductCategory = module.exports = mongoose.model("ProductCategory", ProductCategorySchema);