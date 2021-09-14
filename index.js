const express = require("express");
const app = express();
const mongoose = require("mongoose");
const general = require("./routes/general");
require("dotenv").config();
const cors = require('cors')


app.disable('x-powered-by');
app.use(cors({ origin: 'http://localhost:3000' , credentials :  true,  methods: 'GET,PUT,POST,OPTIONS', allowedHeaders: 'Content-Type,Authorization' }));


app.use(express.json());
app.use(express.urlencoded({extended:false}));

const DATABASE_URI = process.env.DATABASE_URI;
mongoose.connect(DATABASE_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on("connected",()=>console.log("db connected"))




app.use("/", general)



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`App is started at: ${PORT}`)
})
