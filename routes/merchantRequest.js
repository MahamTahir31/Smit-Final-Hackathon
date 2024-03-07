const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },


    payMethod: {
        type: String,
        required: true
    },


    created: {
        type: Date,
        required: true,
        default: Date.now
    }
})


module.exports = mongoose.model("merchantPayments", userSchema)