var mongoose = require("mongoose")

// Media Schema
const MediaSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    alt:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    keywords:{
        type: String
    },
    link:{
        type: String
    }
})

const Media = module.exports = mongoose.model("Media", MediaSchema);