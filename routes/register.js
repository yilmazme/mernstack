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
  let { email, password } = req.body;
  //check validation
  let { error } = validateFunction(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  //check user exist
  let user = await UserSchema.findOne({ email: email });

  if (user) {
    res.status(400).json({ error: `this email not available: ${email}` });
  } else {
    //hash password
    let salt = await bcrypt.genSalt(11);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new UserSchema({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: "uploads/user.png",
      doorimage: "uploads/defaultdoor.png",
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
