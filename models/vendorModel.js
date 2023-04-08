const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    category:{
        type : String,
        required: true
    },
    name:{
        type : String,
        required: true
    },
    location :{
        type : Array,
        required: true
    },
    email:{
        type : String,
        required: true
    },
    phone:{
        type : String,
        required: true
    },
    image:{
        type : String,
        required: true
    },
    price:{
        type : String,
        required: true
    }
})

vendorDetails = mongoose.model('vendor',vendorSchema)

module.exports = vendorDetails