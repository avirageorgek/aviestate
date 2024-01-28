import {errorHandler} from "../util/error.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export const test = (req, res) => {
    return res.send("Test api");
} 


export const updateProfile = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) return next(errorHandler(400, "You can only update your own account"));

        const updatedUserObj = {
            username: req.body.username, 
            email: req.body.email, 
            avatar: req.body.avatar
        }
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            updatedUserObj.password = req.body.password
        }
   
        const updateStatus = await UserModel.findByIdAndUpdate(req.user.id, {
            $set : updatedUserObj   
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
        
        next(errorHandler(500, "An error occured while updating profile."));
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler("You can only delete your own account"));
    try {
        const result = await UserModel.findByIdAndDelete(req.params.id);
        
        res.clearCookie("access_token");
        return res.status(200).json({
            success: true,
            message: "Successfully deleted",
            data: null
        });

    } catch(err) {
        next(errorHandler(500, "An error occured while trying to delete user"));
    }
}

export const signOutUser = (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler("You can only delete your own account"));
    console.log("Signout user");
    try {
        res.clearCookie("access_token");
        return res.status(200).json({
            success: true,
            message: "Successfully deleted",
            data: null
        });
    } catch(err) {

        next(errorHandler(500, "Failed to Sign out"));
    }
}