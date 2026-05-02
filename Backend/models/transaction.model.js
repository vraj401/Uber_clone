
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  orderId:{
    type:String,
    required:true,
    unique:true
  },
    paymentId:{
        type:String,
        required:true,
        unique:true
    },
    signature:{
        type:String,
        required:true
    }
    ,
    amount:{
        type:Number,
        required:true
    },
    
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    rideId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);