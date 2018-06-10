var mongoose = require("mongoose")

// Media Category Schema
const MediaCategorySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        type: String
    }
})

const MediaCategory = module.exports = mongoose.model("MediaCategory", MediaCategorySchema);