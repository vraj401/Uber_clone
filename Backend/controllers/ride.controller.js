import { validationResult } from "express-validator";
import rideService from "../services/ride.service.js";
import mapsServices from "../services/maps.services.js";
import { sendMessageToSocketId } from "../socket.js";
import Ride from "../models/ride.model.js";

const getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json({
            success: true,
            fare
        });

        const pickUpCoordinates = await mapsServices.getAddressCoordinate(pickup);
        

       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to calculate fare",
            error: error.message
        });
    }
};

const createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const {userId,pickup, destination, vehicleType } = req.body;
   
    
    try {   
        const ride = await rideService.createRide({ user:req.user._id, pickup, destination, vehicleType });
        await ride.save();
        ride.otp = ""
        
    
        const pickUpCoordinates = await mapsServices.getAddressCoordinate(pickup);
        console.log("Pickup coordinates:", pickUpCoordinates);
        
        const captainsInRadius = await mapsServices.getCaptainsInRadius(pickUpCoordinates.ltd, pickUpCoordinates.lng, 2); // 5 km radius
        
    
        console.log("Captains in radius:", captainsInRadius);
         const rideWithUser = await Ride.findOne({_id:ride._id}).populate("user");
         rideWithUser.distance = await rideService.getDistance(pickup, destination);

   captainsInRadius.map(captain => {
        console.log("Notifying captain:", captain._id,ride);
        return sendMessageToSocketId(captain.socketId,{
            event:"new-ride",
            data:rideWithUser
        });
   })




    } catch (error) {
        console.error("Ride creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create ride",
            error: error.message
        });
    }
};

const confirmRide = async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const {rideId, otp} = req.body;
    console.log("Received confirm ride request:",otp );
    
    try {
        console.log("Otp from driver", otp );
        const ride = await rideService.confirmRide(rideId, otp, req.captain._id);
        
       sendMessageToSocketId(ride.user.socketId,{
        event:"ride-confirmed",
        data:ride
       })

       return res.status(200).json({
        success:true,
        message:"Ride confirmed",
        ride
       })
    } catch (error) {
        console.error("Ride confirmation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to confirm ride",
            error: error.message
        });
    }


}

const rideAccepted = async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    const {rideId} = req.body;

    const ride = await Ride.findByIdAndUpdate(req.body.rideId,{captain:req.captain._id, status:"accepted"}, {new:true}).populate("user").populate("captain");
    try {
        
        sendMessageToSocketId(ride.user.socketId,{
            event:"ride-Accepted",
            data:ride
           })
        return res.status(200).json({
            success:true,
            message:"Ride accepted",
            ride
           })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Failed to accept ride",
            error: error.message
        });
    }

}

const rideCompleted = async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const {rideId} = req.body;
    try {
        const ride = await Ride.findByIdAndUpdate(rideId,{captain:req.captain._id, status:"completed"}, {new:true}).populate("user").populate("captain");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }
        
        sendMessageToSocketId(ride.user.socketId,{
            event:"ride-completed",
            data:ride
           })
        return res.status(200).json({
            success:true,
            message:"Ride Completed",
            ride
           })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Failed to Complete ride",
            error: error.message
        });
    }


   

}

const getOtpForUser = async (req, res) => {
    try {
        const { rideId } = req.query;

        if (!rideId) {
            return res.status(400).json({
                success: false,
                message: "Ride ID is required"
            });
        }

        const ride = await Ride.findById(rideId).select("+otp");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Invalid ride ID"
            });
        }

        return res.status(200).json({
            success: true,
            otp: ride.otp
        });

    } catch (error) {
        console.error("OTP fetch error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get OTP",
            error: error.message
        });
    }
};
export default {
    getFare,
    createRide,
    confirmRide,
    rideAccepted,
    getOtpForUser,
    rideCompleted
};
