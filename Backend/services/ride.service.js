import { get } from "mongoose";
import rideModel from "../models/ride.model.js";
import mapService from "./maps.services.js";
import crypto from "crypto";


const getFare = async (pickup,destination) => {
if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    console.log("Distance and Time:", distanceTime);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

   return fare;
   
}
const getDistance = async (pickup,destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    console.log("Distance and Time:", distanceTime);

    return distanceTime.distance.value / 1000; // return distance in km
}

const createRide = async ({
    user,pickup,destination,vehicleType
}) => {

    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required');
    }

    console.log("Creating ride with:", { user, pickup, destination, vehicleType });
    const fare = await getFare(pickup,destination);


    const ride = new rideModel({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        otp: getOtp(6)
    });

    return ride;

}


const getOtp = (num=6) =>{
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

const confirmRide = async (rideId, otp) => {
    if(!rideId || !otp){
        throw new Error('Ride ID and OTP are required');
    }

    console.log("Confirming ride with:", { rideId, otp });
    const ride = await rideModel.findById(rideId).populate("user").populate("captain").select("+otp");
    if(otp !== ride.otp){
        console.log("Provided OTP:", otp);
        console.log("Expected OTP:", ride.otp);
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({_id:rideId}, { status: 'accepted',captain:ride.captain._id });

   
    if(!ride){
        throw new Error('Invalid ride ID or OTP');
    }

    return ride;
}




export default {
    createRide,
    getFare,
    getOtp,
    getDistance,
    confirmRide
};