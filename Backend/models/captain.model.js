import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,"First name must be at least 3 characters long"]
        },
        lastname:{
            type:String,
            minlength:[3,"Last name must be at least 3 characters long"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please enter a valid email address"]
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Inactive"

},
vehicle:{
    plate:{
        type:String,
        required:true,
        unique:true
    },
    capacity:{
        type:Number,
        required:true,
        min:[1,"Capacity must be at least 1"],
},
vehicleType:{
    type:String,
    enum:["car","motorcycle","auto"],
    required:true
}
},
location:{
    lat:{
        type:Number
    },
    lng:{
        type:Number
    }
}
})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"24h"})
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

captainSchema.statics.hashPassword = async function(password){
    
    return await bcrypt.hash(password,10)
}

const captainModel = mongoose.model("captain",captainSchema)

export default captainModel