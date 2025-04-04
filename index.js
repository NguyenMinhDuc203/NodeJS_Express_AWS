// npm install ejs, nodemon, express, multer, aws-sdk

const express = require("express");
const multer = require("multer");
const path = require("path");
// const data = require("./data");
const upload = multer();
const app = express();



const AWS = require("aws-sdk");
const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "code"
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Persons";


app.use(express.static("./view"));
app.set("views", "./view");
app.set("view engine", "ejs");


app.listen(3000, ()=>{
    console.log("Running on port 3000...")
});

// app.get("/",(req, res)=>{
//     return res.render("index", {data:data});
// });

// app.post("/", upload.none(),(req, res)=>{

//     data.push(req.body);
//     console.log(req.body);
//     return res.redirect("/");
// });

// app.post("/del/:cccd", (req, res)=>{

//     const {cccd} = req.params;
//     const index = data.findIndex(item => item.cccd===cccd);
//     if(index !== -1){
//         data.splice(index, 1);
//         console.log("Xoa thanh cong.");
//     }
//     else{

//         console.error(`Loi!!! Xoa khong thanh cong.`);
//     }
//     return res.redirect("/");
// });


app.get("/", (req, res)=>{
    const params = {
        TableName : tableName,
    }

    docClient.scan(params, (err, data)=>{
        if(err){
            console.log("ERROR!! DON'T SCAN THIS DOCUMENTS");
            return res.status(500).send("Loi Scan");
        }
        else{
            console.log("SCAN SUCCESSFUL THIS DOCUMENTS");
            return res.render("index", {data:data.Items});
        }
    })
});

app.post("/del/:cccd", (req, res)=>{
    const {cccd} = req.params;
    const params ={
        TableName: tableName,
        Key:{

            cccd : cccd,
        }
        
    }
    docClient.delete(params, (err, data)=>{
        if(err){
            console.log("ERROR!! DON'T DELETE THIS DOCUMENTS");
            return res.status(500).send("Loi Delete");
        }
        else{
            console.log("DELETE SUCCESSFUL THIS DOCUMENTS");
            return res.redirect("/");
        }
    });
});

app.post("/", upload.none(), (req, res)=>{
    const {cccd, sdt, dob, email} = req.body;
    const sdtRegex = /^[0-9]{10,11}$/;
    if(!sdtRegex.test(sdt)){
        return res.status(500).send("Invalid phone 10-12 digits");
    }
    const params ={
        TableName : tableName,
        Item:{
            "cccd": cccd,
            "sdt": sdt,
            "dob": dob,
            "email": email
        }
    }
    docClient.put(params, (err, data)=>{
        if(err){
            console.log("ERROR!! DON'T PUT THIS DOCUMENTS");
            return res.status(500).send("Loi PUT");
        }
        else{
            console.log("PUT SUCCESSFUL THIS DOCUMENTS");
            return res.redirect("/");
        }
    })
})