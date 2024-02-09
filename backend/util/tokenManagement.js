import jwt from "jsonwebtoken";
import {errorHandler} from "../util/error.js";

export const createToken = (dataObj) => {
    const token = jwt.sign(dataObj, process.env.JWT_TOKEN_SECURITY_KEY);

    return token;
}

export const verifyToken = async (req, res, next) => {
    try {
        const {access_token} = req.cookies;
        var tokenStatus = jwt.verify(access_token, process.env.JWT_TOKEN_SECURITY_KEY);
        if(tokenStatus) {

            req.user = tokenStatus;

            next();
        }
    } catch(err) {
        console.log(err);
        next(errorHandler(400, "Bad request"));
    }
    

}
