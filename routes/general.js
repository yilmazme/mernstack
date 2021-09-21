const express = require("express");
const general = express.Router();
const mongoose = require("mongoose");
const UserSchema = require("../schemas/User");
const auth = require("./auth");
const register = require("./register");
const validateFunction = require("./validation");
const jwt = require("jsonwebtoken");
const path = require("path");

const multer = require("multer");

general.get("/api", (req, res) => {
  res.json("welcome");
});

//login

general.use("/api/login", auth);

//register

general.use("/api/register", register);

// verify middleware
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
    .catch((err) => res.status(400).json({ error: err }));
});

//get profile
general.get("/api/user/:id", verify, async (req, res) => {
  UserSchema.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json({ error: err }));
});

//upload profile photo

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

general.post(
  "/api/user/upload",
  verify,
  upload.single("myFile"),
  async (req, res) => {
    let id = req.user.id;
    try {
      const doc = await UserSchema.findOneAndUpdate(
        { _id: id },
        { image: req.file.path },
        { new: true }
      );
      doc.token = null;
      await doc.save();
      res.status(200).json("your picture updated");
    } catch (error) {
      res.json(error);
    }
    console.log(req.body);
    console.log(req.file.path);
  }
);

//delete user,
general.delete("/api/delete/:id", verify, (req, res) => {
  let id = req.params.id;
  if (req.user.id === id || req.user.isadmin) {
    UserSchema.findOneAndDelete({ _id: id }).exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).send("user deleted");
    });
  } else {
    res.status(403).send("you are not allowed");
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
