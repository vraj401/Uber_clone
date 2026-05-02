import axios from "axios";
import captainModel from "../models/captain.model.js";
import { get } from "mongoose";


export const getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === "OK") {
    //         const location = response.data.results[0].geometry.location;
    //         return {
    //             // ltd: location.lat,
    //             // lng: location.lng

    //             ltd:22.99322654534842 ,
    //             lng:72.49809207491148
    //         };
    //     }

    //     throw new Error("Unable to fetch coordinates");
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }

    return {
                // ltd: location.lat,
                // lng: location.lng

                ltd:23.014778129999993 ,
                lng:73.06861876999997
            };

};

export const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        // const response = await axios.get(url);
       

        // if (response.data.status !== "OK") {
        //     throw new Error("Unable to fetch distance and time");
        // }

        // const element = response.data.rows?.[0]?.elements?.[0];

     const element = { 
  "destination_addresses": {destination},
  "origin_addresses": {origin},
  "distance": {
            "text": "23.4 km",
            "value": 23400
          },
  "duration": {
  "text": "35 mins",
  "value": 2100
          },
  "status": "OK"
        ,
  "status": "OK"
};


        if (!element || element.status === "ZERO_RESULTS") {
            throw new Error("No route found between the origin and destination");
        }

        return element;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// export const getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error("Origin and destination are required");
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status !== "OK") {
//             throw new Error("Unable to fetch distance and time");
//         }

//         const element = response.data.rows?.[0]?.elements?.[0];

//         if (!element || element.status === "ZERO_RESULTS") {
//             throw new Error("No route found between the origin and destination");
//         }

//         return element;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

export const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const locations = [
    { description: "123 Main St, Springfield" },
    { description: "456 Elm St, Springfield" },
    { description: "789 Oak St, Springfield" },
    { description: "101 Pine St, Springfield" },
    { description: "202 Maple St, Springfield" }
  ];

  

  try {


    // fallback (important)
    return locations;

  } catch (error) {
    console.error("Request failed:", error);

    // fallback on error
    return locations;
  }
};

export const getCaptainsInRadius = async (ltd,lng, radius) => {

    // radius in kms

    console.log("Finding captains within radius:", { ltd, lng, radius });

    const captains = await captainModel.find({
        location: {
            $geoWithin:{
                $centerSphere: [[ltd, lng], radius / 6371]
            }
}
    })
    return captains;
}

export default {
    getAddressCoordinate,
    getDistanceTime,
    getAutoCompleteSuggestions,
    getCaptainsInRadius
};
