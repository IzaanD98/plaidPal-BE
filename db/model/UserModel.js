const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    // required: true,
    unique: true,
  },
  displayName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  googleAccessToken: {
    type: String,
  },
  access_token: {
    type: String,
  },
  account_ids: {
    type: Array,
  },
  firstName:{
    type: String,
  },
  lastName:{
    type: String,
  },
  picture:{
    type: String,
  },
  token:{
    type: String,
  },
  notes:{
    type: Array,
  }
});

module.exports = mongoose.model("User", userSchema);
