const express = require("express");
const general = express.Router();
const mongoose = require("mongoose");
const User = require("../schemas/User");
const UserSchema = require("../schemas/User");
const auth = require("./auth");
const validateFunction = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

general.get("/api", (req, res) => {
  res.json("welcome");
});

//login

general.use("/api/login", auth);

// verify
const verify = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("you are not authenticated");
  }
  jwt.verify(token, process.env.SECRET_DE_SUS_OJOS, (err, jwtPayload) => {
    if (err) return res.status(403).json("token is not valid");
    req.user = jwtPayload;
    next();
  });
};

// will list all users
general.get("/api/users", verify, (req, res) => {
  UserSchema.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(204).json(err));
});

//register

general.post("/api/users", async (req, res) => {
  let { username, password } = req.body;
  //check validation
  let { error } = validateFunction(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  //check user exist
  let user = await UserSchema.findOne({ username: username });

  if (user) {
    res.status(400).json(`this username not available: ${username}`);
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
      res.status(400).json(error);
    }
  }
});

//delete user,

general.delete("/api/delete/:id", verify, (req, res) => {
  let id = req.params.id;
  if (req.user.id === id || req.user.isadmin) {
    UserSchema.findOneAndDelete({ _id: id }).exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    });
  } else {
    res.status(403).json("you are not allowed");
  }
});

//logout
general.post("/api/logout", verify, async (req, res) => {
  let id = req.user.id;
  try {
    const doc = await UserSchema.findById(id);
    doc.token = null;
    await doc.save();
    res.status(200).json("you logged out");
  } catch (error) {
    res.json(error);
  }
});

module.exports = general;
