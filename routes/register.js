const express = require("express");
const register = express.Router();
const UserSchema = require("../schemas/User");
const validateFunction = require("./validation");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//register

register.post("/", upload.array("photos", 4), async (req, res) => {
  let { username, password } = req.body;
  //check validation
  let { error } = validateFunction(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  //check user exist
  let user = await UserSchema.findOne({ username: username });

  if (user) {
    res.status(400).json({ error: `this username not available: ${username}` });
  } else {
    //hash password
    let salt = await bcrypt.genSalt(11);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new UserSchema({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    try {
      newUser.save();
      res.json(newUser);
    } catch (error) {
      res
        .status(400)
        .json({ error: "sunucu kaynaklı hata oluştu, kaydınız yapılamadı" });
    }
  }
});

module.exports = register;
