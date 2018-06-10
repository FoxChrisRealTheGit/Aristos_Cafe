var mongoose = require("mongoose")

// Conatct Message Schema
const contactMessageSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
})

const ContactMessage = module.exports = mongoose.model("ContactMessage",contactMessageSchema);