import React, { use, useEffect, useRef } from "react";
import { useState,useContext } from "react";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicalPanel from "../components/VehicalPanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitForDriver from "../components/WaitingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";



const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [fare, setFare] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const [distance, setDistance] = useState(null)

  const { socket } = useContext(SocketContext);
  const {user} = useContext(UserContext);
const [otp, setOtp] = useState(null);


 
  useEffect(() => {
    socket.on("ride-Accepted", async (ride) => {

      const otpResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/getOtpUser`,{
        params:{
          rideId:ride._id
        },
        headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
      });

     
      setVehiclePanel(false);
      setConfirmRidePanel(false);
      setVehicleFound(false);
      setWaitingForDriver(true);

const newOtp = otpResponse.data.otp;
setOtp(newOtp);

    });

    socket.on("ride-confirmed", (ride) => {
      setWaitingForDriver(false);
      console.log("Ride confirmed:", ride);
      alert("Your ride has been started! Pay the driver when you reach your destination.");
    })
    
    return () => {
      socket.off("ride-Accepted");
    };
  },[socket])


  useEffect(() => {

    socket.emit("join",{userType:"user", userId:user._id})
   
  },[ user]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
if(e.target.value === ""){
  setSuggestions([]);
  return;
}
    try{
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

    });
    console.log("Suggestions fetched:", response.data.suggestions);
    setPickupSuggestions(response.data.suggestions);
    if(activeField === "pickup"){
      setSuggestions(response.data.suggestions);
    }

  }catch(error){
    console.error("Error fetching suggestions:", error);
  }

}

const findTrip = async () => {
  if (pickup?.trim()  && destination?.trim()) {
    setVehiclePanel(true);
    setPanelOpen(false);
}else{
  alert("Please enter both pickup and destination locations.")
}

const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

    });
  

setFare(response.data.fare);


}
  
  const handleDestinationChange = async(e) => {
    setDestination(e.target.value);
    if(e.target.value === ""){
      setSuggestions([]);
      return;
    }

    try{
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
                
    });
    setDestinationSuggestions(response.data.suggestions);
    if(activeField === "destination"){
      setSuggestions(response.data.suggestions);
    }
    }catch(error){
      console.error("Error fetching suggestions:", error);

    }
  }

  useGSAP(
    function () {
      gsap.to(panelRef.current, {
        height: panelOpen ? "100%" : "0%",
        padding: panelOpen ? 24 : 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: panelOpen ? 1 : 0,
        pointerEvents: panelOpen ? "all" : "none",
      });
    },
    [panelOpen],
  );

useGSAP(
  function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  },
  [vehiclePanel],
);

useGSAP(
  function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  },
  [confirmRidePanel],
);

useGSAP(
  function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(200%)",
      });
    }
  },
  [vehicleFound],
);


useGSAP(
  function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(200%)",
      });
    }
  },
  [waitingForDriver],
);

const createRide = async (vehicleType) => {

const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create-ride`, {
  pickup,
  destination,
  vehicleType
},{
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
}

  return (
    <div className="h-screen relative overflow-hidden">
      <div>
        {" "}
        <img
          className="w-16 absolute left-5 top-5"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber logo"
        />
      </div>

      <div  className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSixb3-y80u_w_UbHzb1pmvRu2WYSWgweAG3w&s"
          alt=""
        />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="min-h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="opacity-0 absolute right-6 top-6 text-2xl "
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            action=""
          >
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full "></div>
            <input
              onClick={(e) => {
                setPanelOpen(true)
                setActiveField("pickup")
              }}
              value={pickup}
              onChange={(e) => handlePickupChange(e)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Pick-up location"
            />
            <input
              value={destination}
              onClick={(e) => {
                setPanelOpen(true)
                setActiveField("destination")
              }}
              onChange={(e) => handleDestinationChange(e)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Destination location"
            />
          <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
          </form>
        </div>

        <div ref={panelRef} className=" bg-white  h-0">
          <LocationSearchPanel 
 suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
          setPanelOpen={setPanelOpen} 
          setVehiclePanel={setVehiclePanel} 
          setPickup={setPickup}
          setDestination={setDestination}
          activeField={activeField}
          pickup={pickup}
          destination={destination}
          setSuggestions={setSuggestions}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-full pt-12 px-3 py-10">
       <VehicalPanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} fare={fare} setVehicleType={setVehicleType}/>
      </div>

       <div ref={confirmRidePanelRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-full pt-12 px-3 py-6">
       <ConfirmRide createRide={createRide} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} fare={fare} pickup={pickup} destination={destination} vehicleType={vehicleType}/>
      </div>

      <div ref={vehicleFoundRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-[200%] pt-12 px-3 py-6">
       <LookingForDriver setVehicleFound={setVehicleFound} pickup={pickup} destination={destination} vehicleType={vehicleType}/>
      </div>

      <div ref={waitingForDriverRef} className="fixed w-full z-10 translate-y-[200%] bg-white bottom-0  pt-12 px-3 py-6">
       <WaitingForDriver setWaitingForDriver={setWaitingForDriver} pickup={pickup} destination={destination} vehicleType={vehicleType} otp={otp}/>
      </div>

       

    </div>
  );
};

export default Home;
