import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async(req,res, next)=>{
    try {

        // const token = req.header("Authorization").replace("Bearer ", "") || req.cookies.token
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401)
            .json({
                message: "Authorization failed"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.
        status(401).
        json(
            {
                message: "Authorization failed"
            }
            );
    }
}
export default auth;