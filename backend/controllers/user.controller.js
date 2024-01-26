import {errorHandler} from "../util/error.js";

import UserModel from "../models/user.model.js";

import bcrypt from "bcrypt";

export const test = (req, res) => {
    return res.send("Test api");
} 


export const updateProfile = async (req, res, next) => {
    try {
        if(!req.user.id) return next(errorHandler(400, "Bad request"));

        let {username, email, password = null, avatar} = req.body;
        if(!username || !email) {
            next(errorHandler(400, "Bad request"));
        }

        if(password) {
           password = bcrypt.hashSync(password, 10);
        }
   
        const updateStatus = await UserModel.findByIdAndUpdate(req.user.id, {
            $set : {
                username, email, password, avatar
            }    
        }, {new: true});
        const {password: pass, ...rest} = updateStatus._doc; 
        if(updateStatus) {
            return res.status(200).json({
                success:true,
                message: "Success",
                data: rest
            });
        }
    } catch(err) {
        console.log(err);
        next(errorHandler(500, "An error occured while updating profile."));
    }
}