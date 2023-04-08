const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },  
  email:{
    type: String,
    required: true
  },  
  phone:{
    type: String,
    required: true
  },  
  city:{
    type: String,
    required: true
  },  
  state:{
    type: String,
    required: true
  },  
  zip:{
    type: String,
    required: true
  },  
  query:{
    type: String,
    required: true
  }  
})
const contactDetails = mongoose.model('contact', contactSchema);

module.exports = contactDetails