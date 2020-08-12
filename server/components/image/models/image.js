const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Schema.Types
const ImageSchema = new Schema({
    image: {

    },
    user : {
        type : ObjectId,
        ref : "users"
    },
    shared_with :[
        {
            type : String
        }
    ],
    created_at : {
        type : Date,
        default: Date.now
    }
})

const User = mongoose.model("images", ImageSchema)
module.exports = User
