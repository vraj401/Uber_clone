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
        password:hashedPassword,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
        
    })

    const token = captain.generateAuthToken();

    res.status(201).json({token,captain})
}

export default {
    registerCaptain
}