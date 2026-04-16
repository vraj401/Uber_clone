import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import {validationResult} from "express-validator";
import BlackListToken from "../models/blackList_token.model.js";


 const registerUser = async (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }

    const {fullname,email,password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    })

    const token = user.generateAuthToken();

    res.status(201).json({token,user})

}


const loginUser = async (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }
    
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"Invalid credentials"
        })
    }

    const token = user.generateAuthToken();

     res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
    
    res.status(200).json({token,user})

}

const getProfile = async (req,res,next) => {
    res.status(200).json({user:req.user})
}

const logoutUser = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await BlackListToken.create({token})
    res.clearCookie("token");

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })

}



export default {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}