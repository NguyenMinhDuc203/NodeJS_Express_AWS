// npm install ejs, nodemon, express, multer, aws-sdk

const express = require("express");
const multer = require("multer");

const data = require("./data");
const upload = multer();
const app = express();
app.use(express.static("./view"));
app.set("views", "./view");
app.set("view engine", "ejs");


app.listen(3000, ()=>{
    console.log("Running on port 3000...")
});

app.get("/",(req, res)=>{
    return res.render("index", {data:data});
});

app.post("/", upload.none(),(req, res)=>{

    data.push(req.body);
    console.log(req.body);
    return res.redirect("/");
});

app.post("/del/:cccd", (req, res)=>{

    const {cccd} = req.params;
    const index = data.findIndex(item => item.cccd===cccd);
    if(index !== -1){
        data.splice(index, 1);
        console.log("Xoa thanh cong.");
    }
    else{

        console.error(`Loi!!! Xoa khong thanh cong.`);
    }
    return res.redirect("/");
});
