// require kiya express ko 
// const express = require("express")
// reat object 
import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/db.js"



// dotenv cofiguration 

dotenv.config()

// connect db
connectDB();


const app = express()



//routes
app.get("/",(req,res)=>{
    res.send("welcome to job portal ki chut")
})


//port
const PORT = process.env.PORT || 8000

//listen 
app.listen(PORT,()=>{
    console.log(
        `node server is running in ${process.env.DEV_MODE} Mode on port no ${PORT}`.bgCyan.green)
})