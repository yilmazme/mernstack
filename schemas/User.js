const { boolean, string } = require("joi");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  isadmin: { type: Boolean, default: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  dofj: { type: Date, default: Date.now },
  token: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);
