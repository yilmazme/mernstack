const express = require("express");
const auth = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = require("../schemas/User");
const bcrypt = require("bcryptjs");

auth.use(express.json());
auth.use(express.urlencoded({ extended: false }));

//refresh token
auth.post("/refresh", async (req, res) => {
  let refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json("not authenticated");
  }
  let user = await UserSchema.findOne({ token: refreshToken });
  if (!user) {
    res.status(403).json("invalid token");
  }

  let newAccessToken = generateAccessToken(user);

  res.status(200).json({ newAccessToken: newAccessToken });
});

//generate tokens
const generateAccessToken = (user) => {
  let accessToken = jwt.sign(
    { id: user._id, isadmin: user.isadmin },
    process.env.SECRET_DE_SUS_OJOS,
    { expiresIn: "30s" }
  );
  return accessToken;
};
const generateRefreshToken = (user) => {
  let refreshToken = jwt.sign(
    { id: user._id, isadmin: user.isadmin },
    process.env.REFRESH_SUS_OJOS
  );
  return refreshToken;
};

//login
auth.post("/", async (req, res) => {
  const { username, password } = req.body;

  let user = await UserSchema.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ error: "Username or Password incorrect" });
  }

  let passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).json({ error: "Username or Password incorrect" });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await UserSchema.findOneAndUpdate(
    { username: username },
    { token: refreshToken }
  );
  res.json({
    id: user._id,
    isadmin: user.isadmin,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

module.exports = auth;
