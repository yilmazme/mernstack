const express = require("express");
const app = express();
const mongoose = require("mongoose");
const general = require("./routes/general");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

app.disable("x-powered-by");

const origin = {
  dev: "http://localhost:3000",
  prod: "https://mydoors.herokuapp.com",
};

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? origin.prod : origin.dev,
    credentials: true,
    methods: "GET,PUT,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// app.use(
//   cors({
//     //in production for dev change this
//     origin: "https://mydoors.herokuapp.com/",
//     credentials: true,
//     methods: "GET,PUT,POST,OPTIONS",
//     allowedHeaders: "Content-Type,Authorization",
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URI = process.env.DATABASE_URI;
mongoose.connect(DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("db connected"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", general);



if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is started at: ${PORT}`);
});
