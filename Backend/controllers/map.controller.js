import mapsServices from "../services/maps.services.js";
import { validationResult } from "express-validator";

const getCoordinates = async (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }

    const {address} = req.query;

    try {
        const coordinates = await mapsServices.getAddressCoordinate(address);
        res.status(200).json({
            success:true,
            coordinates
        })
    } catch (error) {
        res.status(404).json({
            success:false,
            message:"Failed to get coordinates",
            error:error.message
        })
    }
}

const getDistanceTime = async (req,res,next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { origin, destination } = req.query;
        const distanceTime = await mapsServices.getDistanceTime(origin, destination);
        res.status(200).json({
            success: true,
            distanceTime
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to get distance and time",
            error: error.message
        });
    }
};

const getAutoCompleteSuggestions = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapsServices.getAutoCompleteSuggestions(input);
        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to get autocomplete suggestions",
            error: error.message
        });
    }
};




export default {
    getCoordinates,
    getDistanceTime,
    getAutoCompleteSuggestions
}
