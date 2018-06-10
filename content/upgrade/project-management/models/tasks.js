var mongoose = require("mongoose")

// Blog Schema
const TaskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    assigned:{
        type: String
    },
    // published:{
    //     type: String,
    //     required: true
    // },
    completed:{
        type: Number
    },
    content:{
        type: String,
        required: true
    }
})

const Task = module.exports = mongoose.model("Task", TaskSchema);