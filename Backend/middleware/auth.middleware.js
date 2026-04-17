import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import BlackListToken from "../models/blackList_token.model.js";


export const authUser = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
 
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized,token not found"
        })
    }

    if(await BlackListToken.findOne({token:token})){
        return res.status(401).json({
            success:false,
            message:"Unauthorized token is blacklisted"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        const user = await userModel.findById(decoded._id);

        req.user = user;
        return next();

}catch (error) {
    return res.status(401).json({
        success:false,
        message:"Unauthorized token is invalid",
        error:error
    })
}
}

export const authCaptain = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
 
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized,token not found"
        })
    }

    if(await BlackListToken.findOne({token:token})){
        return res.status(401).json({
            success:false,
            message:"Unauthorized token is blacklisted"
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized token is invalid",
            error:error
        })
    }
}

