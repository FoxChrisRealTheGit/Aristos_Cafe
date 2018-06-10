var mongoose = require("mongoose")

// Blog Schema
const NoteSchema = mongoose.Schema({
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

const Note = module.exports = mongoose.model("Note", NoteSchema);