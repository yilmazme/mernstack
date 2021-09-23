const express = require("express");
const auth = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = require("../schemas/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");

auth.use(express.json());
auth.use(express.urlencoded({ extended: false }));

//for google login
const client = new OAuth2Client(
  process.env.GOOGLE_API_KEY
);
//

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
    { expiresIn: "10m" }
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
  const { email, password } = req.body;

  let user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "email or Password incorrect" });
  }

  let passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).json({ error: "email or Password incorrect" });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await UserSchema.findOneAndUpdate(
    { email: email },
    { token: refreshToken }
  );
  res.json({
    id: user._id,
    isadmin: user.isadmin,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

//google register and/or login

auth.post("/google", async (req, response) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:process.env.GOOGLE_API_KEY
    })
    .then((res) => {
      const { email_verified, name, email } = res.payload;

      if (email_verified) {
        UserSchema.findOne({ email: email }).exec(async (err, user) => {
          if (err) {
            return response
              .status(400)
              .json({ error: "something went wrong!" });
          } else {
            if (user) {
              //must login without save again
              const accessToken = generateAccessToken(user);
              const refreshToken = generateRefreshToken(user);
              await UserSchema.findOneAndUpdate(
                { email: email },
                { token: refreshToken }
              );
              response.json({
                id: user._id,
                isadmin: user.isadmin,
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            } else {
              // must register
              let password = email.substring(0, 4) + name.substring(0, 5);
              let salt = await bcrypt.genSalt(11);
              let hashedPassword = await bcrypt.hash(password, salt);

              let newUser = new UserSchema({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                email: email,
                password: hashedPassword,
              });
              //registration will continue with login
              newUser.save(async (err, data) => {
                if (err) {
                  return response
                    .status(400)
                    .json({ error: "something went wrong!" });
                } else {
                  // here we create login parameter from just saved data
                  const accessToken = generateAccessToken(data);
                  const refreshToken = generateRefreshToken(data);
                  await UserSchema.findOneAndUpdate(
                    { email: email },
                    { token: refreshToken }
                  );
                  response.json({
                    id: newUser._id,
                    isadmin: newUser.isadmin,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  });
                }
              });
            }
          }
        });
      }

      console.log(res.payload);
    });
});

module.exports = auth;
