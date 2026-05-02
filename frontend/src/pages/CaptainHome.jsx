import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useContext,useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";



const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);

  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const confirmRidePopupPanelRef = useRef(null);
  const {socket} = useContext(SocketContext);
  const {captain} = useContext(CaptainDataContext);
  const {ride}=useContext(CaptainDataContext);
  const {setRide}=useContext(CaptainDataContext);

  const otp = useContext(CaptainDataContext).otp;
const setOtp = useContext(CaptainDataContext).setOtp;

 useEffect(() => {
  if (!socket) return;

  const handleNewRide = (ride) => {
    console.log("Received new ride:", ride);
    setRide(ride);
    setRidePopupPanel(true);
  };
  socket.off("new-ride");
  socket.on("new-ride", handleNewRide);

  return () => {
    socket.off("new-ride", handleNewRide);
  };
}, [socket]);

  useEffect(() => {
    socket.emit("join",{userType:"captain", userId:captain._id})
    
    const updateLocation = ()=>{
      if(navigator.geolocation){
        console.log("Updating location...")
   
        navigator.geolocation.getCurrentPosition((position)=>{
          console.log(position.coords.latitude, position.coords.longitude)
          socket.emit("update-location-captain",{
            userId:captain._id,
            location:{
              ltd:position.coords.latitude,
              lng:position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation,10000);
  
    updateLocation();
    return ()=>{
      clearInterval(locationInterval);
    }

  }, [captain]);


  const confirmRide = async ()=>{
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(false);

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${localStorage.getItem("token")}`
          },
          body:JSON.stringify({
            rideId:ride._id,
            otp:otp
          })
        })

        const data = await response.json();
        if(!response.ok){
          alert(data.message || "Failed to confirm ride");
        }

          return data;
  }

  const rideAcceptHandler = async (rideId) => {
  
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/ride-accepted`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
        rideId:ride._id
      })
    })

    const data = await response.json();
    if(!response.ok){
      console.error("Ride acceptance failed:", data);
      alert(data.message || "Failed to accept ride"); 
    }
    setRide(data.ride ?? data);
};


  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel],
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel],
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSixb3-y80u_w_UbHzb1pmvRu2WYSWgweAG3w&s"
          alt=""
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 translate-y-full  bg-white bottom-0  pt-12 px-3 py-6">
        <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel } rideAcceptHandler={rideAcceptHandler} />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full z-10 h-screen translate-y-full  bg-white bottom-0  pt-12 px-3 py-6">
        <ConfirmRidePopUp setConfirmRidePopupPanel={setConfirmRidePopupPanel} confirmRide={confirmRide} otp={otp} setOtp={setOtp} ride={ride}/>
      </div>
    </div>
  );
};

export default CaptainHome;
