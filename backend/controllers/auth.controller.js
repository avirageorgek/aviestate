import bcrypt from "bcrypt";

import UserModel from "../models/user.model.js";
import { errorHandler } from "../util/error.js";


export const signup = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;

        if(!email || !username || !password) {
            return res.statue(400).json({
                success: false,
                message: "Invalid request"
            })
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const userObj = new UserModel({
            email,
            username,
            password: hashedPassword
        });

        await userObj.save();

        return res.status(200).json({
            success: true,
            message: "User created successfully."
        });
    } catch(err) {
        
        next(errorHandler(500, "An error occured while creating user"));    
    }
    
}