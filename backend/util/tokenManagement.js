import jwt from "jsonwebtoken";

export const createToken = (dataObj) => {
    const token = jwt.sign(dataObj, process.env.JWT_TOKEN_SECURITY_KEY);

    return token;
}
