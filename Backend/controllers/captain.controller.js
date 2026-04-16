import BlackListToken from "../models/blackList_token.model.js";
import captainModel from "../models/captain.model.js";
import captainService from "../services/captain.service.js";
import {validationResult} from "express-validator";

const registerCaptain = async (req,res,next) => {
      const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }

    const {fullname,email,password,plate,capacity,vehicle} = req.body;
    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.registerCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:password,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
        
    })

    const token = captain.generateAuthToken();

    res.status(201).json({token,captain})
}

const loginCaptain = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }

    const {email,password} = req.body;

    const captain = await captainModel.findOne({email}).select("+password");



    if(!captain){
        return res.status(401).json({
            success:false,
            message:"Captain not found"
        })
    }

    const isMatch = await captain.comparePassword(password);

    
    
     if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"Invalid credentials"
        })
     }

    const token = captain.generateAuthToken();

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
    
    res.status(200).json({token,captain})

}

const getProfile = async (req,res,next) => {
    res.status(200).json({captain:req.captain})
}

const logoutCaptain = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await BlackListToken.create({token})
    res.clearCookie("token");
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}

export default {
    registerCaptain,
    loginCaptain,
    getProfile,
    logoutCaptain
}