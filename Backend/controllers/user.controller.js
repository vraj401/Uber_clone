import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import {validationResult} from "express-validator";


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

export default {
    registerUser
}