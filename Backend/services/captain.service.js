import captainModel from "../models/captain.model.js";

const registerCaptain = async ({

    firstname,lastname,email,password,plate,capacity,vehicleType

}) =>{
       if(!email || !password || !firstname || !plate || !capacity || !vehicleType){
        throw new Error("All fields are required")
       }

   try{
       const captain = await captainModel.create({
       fullname:{ 
        firstname,
        lastname
    },
        email,
        password:await captainModel.hashPassword(password),
        vehicle:{
            plate,
            capacity,
            vehicleType
        }
       })}catch(err){
        throw new Error(err)
       }

         return captain;
 

}

export default {
    registerCaptain
}