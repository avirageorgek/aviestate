import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then((data) => {
    console.log("Connection to database successfull.");
})
.catch((error) => {
    console.log("Error occured while connecting to database");
});

const app = express();


app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "An exception occured";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log("Listen to port 3000");
});