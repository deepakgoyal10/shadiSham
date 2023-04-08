// Importing modules
const mongoose = require("mongoose");

// Definieng Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ''
  },
  is_admin: {
    type: String,
    default: 0,
  },
  is_verified: {
    type: String,
    default: 0,
  },
  token_id: {
    type: String,
    default: "",
  },
});

// Compiling Schema into model
const userDetails = mongoose.model("user", userSchema);

// Exporting model
module.exports = userDetails;
