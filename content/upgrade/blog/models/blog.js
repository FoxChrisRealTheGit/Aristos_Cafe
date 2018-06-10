var mongoose = require("mongoose")

// Blog Schema
const BlogSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    published:{
        type: String,
        required: true
    },
    content:{
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
    }
})

const Blog = module.exports = mongoose.model("Blog",BlogSchema);