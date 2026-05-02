import { validationResult } from "express-validator";
import Razorpay from "razorpay";
import transactionModel from "../models/transaction.model.js";
import { verifyPaymentSignature } from "../services/transactions.service.js";

const orderCreate = async (req,res)=>{
      
   try{ 
    const razorpay = new Razorpay(
        {
            key_id:process.env.RAZORPAY_KEY,
            key_secret:process.env.RAZORPAY_SECRET
        }
      ) 

      const options = req.body;
      const order = await razorpay.orders.create(options);

      if(!order){
        return res.status(500).send("Error");
      }



      res.json(order);
    }catch(error){
        console.log(error)
res.status(500).send(error)
      }

}

const verifyAndSaveTransaction  = async (req,res) => {
    // Add this temporarily at the top of verifyAndSaveTransaction
console.log("Secret exists:", !!process.env.RAZORPAY_SECRET);
    console.log("Received payment verification request:", req.body);
    const errors = validationResult(req);
console.log("Validation errors:", errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
     }

      try{   const {order_id, payment_id, signature,amount,rideId,userId} = req.body;

        const isValid = verifyPaymentSignature({
            order_id,
            payment_id,
            signature
        })

        if(!isValid){
            return res.status(400).json({
                success:false,
                message:"Invalid payment signature"
            })
        }

        const transaction = new transactionModel({
    orderId: order_id,       // ✅ was: order_id
    paymentId: payment_id,   // ✅ was: payment_id
    signature: signature,
    amount: amount,
    status: "completed",
    rideId: rideId,          // ✅ was: ride
    userId: userId           // ✅ was: user
});

     await transaction.save();

        res.json({
      success: true,
      message: 'Payment verified & stored',
      transaction
    })
}catch(error){
    console.error("Error verifying payment or saving transaction:", error);
    res.status(500).json({
        success: false,
        message: "Failed to verify payment or save transaction",
        error: error.message
    });
}
}



export default {
 orderCreate,
 verifyAndSaveTransaction
};