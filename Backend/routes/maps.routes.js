import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { getAddressCoordinate } from "../services/maps.services.js";
import mapController from "../controllers/map.controller.js";
const router = express.Router();
import { query } from "express-validator";
import axios from "axios";

router.get('/get-coordinates',
    query('address').not().isEmpty().withMessage('Address is required'),
    authUser,
    getAddressCoordinate
);

router.get('/get-distance-time',
    query('origin').not().isEmpty().withMessage('Origin is required'),
    query('destination').not().isEmpty().withMessage('Destination is required'),
    authUser,
    mapController.getDistanceTime
);

router.get('/get-suggestions',
    query('input').not().isEmpty().withMessage('Input is required'),
    authUser,
    mapController.getAutoCompleteSuggestions
)

export default router;