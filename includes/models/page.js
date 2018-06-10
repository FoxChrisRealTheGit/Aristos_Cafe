var mongoose = require("mongoose")

// Page Schema
const PageSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    parent:{
        type: String
    },
    slug:{
        type: String
    },
    content:{
        type: String,
        required: true
    },
    sorting:{
        type: Number
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

const Page = module.exports = mongoose.model("Page", PageSchema);