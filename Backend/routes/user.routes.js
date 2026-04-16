import express from "express";
const router = express.Router();
import { validationResult } from "express-validator";
import {body} from "express-validator";
import userModel from "../models/user.model.js";
import userController from "../controllers/user.controller.js";
import authUser from "../middleware/auth.middleware.js";

router.post("/register", [
    body('email').isEmail().withMessage("Please enter a valid email address"),  
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body.apply('password').isLength({min:6}).withMessage("Password must be at least 6 characters long")
],
userController.registerUser)

router.post("/login",
    [
        body('email').isEmail().withMessage("Please enter a valid email address"),
        body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long")
    ],
    userController.loginUser
)

router.get("/profile",authUser,userController.getProfile)
router.post("/logout",authUser,userController.logoutUser)


export default router;