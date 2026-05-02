import express from "express";
import { body, query } from "express-validator";
import { authCaptain, authUser } from "../middleware/auth.middleware.js";
import paymentController from "../controllers/Payment.controller.js";

const router = express.Router();

router.post('/create-order',paymentController.orderCreate)

router.post('/verify-payment',
    authUser,
    body("order_id").isString().withMessage("Order ID is required"),
    body("payment_id").isString().withMessage("Payment ID is required"),
    body("signature").isString().withMessage("Signature is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("rideId").isMongoId().withMessage("Invalid ride ID"),
    body("userId").isMongoId().withMessage("Invalid user ID"),
    paymentController.verifyAndSaveTransaction
)

export default router;
