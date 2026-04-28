import express from "express";
import { body, query } from "express-validator";
import { authCaptain, authUser } from "../middleware/auth.middleware.js";
import rideController from "../controllers/ride.controller.js";

const router = express.Router();

router.get(
    "/get-fare",
    query("pickup").isString().isLength({ min: 3 }).withMessage("Pickup location must be at least 3 characters"),
    query("destination").isString().isLength({ min: 3 }).withMessage("Destination must be at least 3 characters"),
    authUser,
    rideController.getFare
);

router.post(
    "/create-ride",
    authUser,
    body("pickup").isString().isLength({ min: 3 }).withMessage("Pickup location must be at least 3 characters"),
    body("destination").isString().isLength({ min: 3 }).withMessage("Destination must be at least 3 characters"),
    body("vehicleType").isIn(["auto", "car", "moto"]).withMessage("Vehicle type must be one of auto, car, or moto"),
   
    rideController.createRide
);


router.post(
    "/confirm",
    authCaptain,
    body("rideId").isMongoId().withMessage("Invalid ride ID"),
    body("otp").isString().isLength({ min: 4}).withMessage("OTP must be greater than 4 characters"),
    rideController.confirmRide
);


router.post(
    "/ride-accepted",
    authCaptain,
    body("rideId").isMongoId().withMessage("Invalid ride ID"),
    rideController.rideAccepted
)

router.get("/getOtpUser",
    authUser,
    query("rideId").isMongoId().withMessage("Invalid ride ID"),
    rideController.getOtpForUser
)

export default router;