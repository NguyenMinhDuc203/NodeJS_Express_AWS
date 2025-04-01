// npm install ejs, nodemon, express, multer, aws-sdk

const express = require("express");
const multer = require("multer");


const app = express();
app.use(express.static("./views"));
app.set("views", "./view");
app.set("view engine", "ejs");


app.listen(3000, ()=>{
    console.log("Running on port 3000...")
});

app.get("/",(req, res)=>{
    return res.render("index");
});

