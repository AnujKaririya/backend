require('dotenv').config()
const express=require('express')
const app=express();
import mongoose from 'mongoose';

async 
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("hello world!!!");   
})
app.get('/twitter',(req,res)=>{
    res.send("hello twitter!");
})
app.post("/users", (req, res) => {
    console.log(req.body);

    res.status(201).json({
        message: "User created",
        user: req.body
    });
});
app.listen(process.env.PORT,()=>{
    console.log(`example app listning on port ${process.env.PORT}`)
})