import express from "express";
const router = express.Router();
import { validationResult } from "express-validator";
import {body} from "express-validator";
import captainController from "../controllers/captain.controller.js";



router.post("/register", [
    body('email').isEmail().withMessage("Please enter a valid email address"),  
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body.apply('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body('vehicle.plate').notEmpty().withMessage("Vehicle plate is required"),
    body('vehicle.capacity').isInt({min:1}).withMessage("Vehicle capacity must be at least 1"),
    body('vehicle.vehicleType').isIn(["car","motorcycle","auto"]).withMessage("Vehicle type must be either car, motorcycle or auto")
],
captainController.registerCaptain)



export default router;