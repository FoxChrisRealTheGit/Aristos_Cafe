var mongoose = require("mongoose")

// Blog Category Schema
const BlogCategorySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        type: String
    }
})

const BlogCategory = module.exports = mongoose.model("BlogCategory", BlogCategorySchema);