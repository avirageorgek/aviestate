import bcrypt from "bcrypt";

import UserModel from "../models/user.model.js";
import { errorHandler } from "../util/error.js";
import { createToken } from "../util/tokenManagement.js";


export const signup = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;

        if(!email || !username || !password) {
            next(errorHandler(400, "Invalid request"))
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

export const signin = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        if(!username || !password) {
            next(errorHandler(400, "Username/ Password is missing"));
            return;
        }

        const userData = await UserModel.findOne({
            username
        });

        if(!userData) {
            next(errorHandler(404, "User not found"));
        }
        const comparePassword = await bcrypt.compare(password, userData.password);
        if(!comparePassword) {
            next(errorHandler(404, "User not found"));
        }

        const jwt = await createToken({
            id: userData._id
        });

        const {password:pass, ...rest} = userData._doc;
        return res.cookie("access_token", jwt, {httpOnly: true, expire: 40000+Date.now()}).status(200).json({
            success: true,
            message: "Successfully logged in",
            data: rest
        });


    } catch(err) {
        console.log(err)
        next(errorHandler(500, "An error occured while signing in")); 
    }
}