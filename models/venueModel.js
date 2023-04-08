const mongoose = require('mongoose');

const venueSchema = mongoose.Schema({
    imaage: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    decs: {
        type: String,
        required: true
    }
})

const venueDetails = mongoose.model('venue', venueSchema)

module.exports = venueDetails