import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then((data) => {
    console.log("Connection to database successfull.");
})
.catch((error) => {
    console.log("Error occured while connecting to database");
});

const app = express();

app.listen(3000, () => {
    console.log("Listen to port 3000");
});