var mongoose = require("mongoose")

// Category Schema
const BlogComments = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    blogref: {
        type: String,
        required: true
    }
})

const BlogComments = module.exports = mongoose.model("BlogComments", BlogComments);