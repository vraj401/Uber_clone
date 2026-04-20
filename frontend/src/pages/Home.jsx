import React, { useRef } from "react";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicalPanel from "../components/VehicalPanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitForDriver from "../components/WaitingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";

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

  const submitHandler = (e) => {
    e.preventDefault();
  };

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
        transform: "translateY(100%)",
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
        transform: "translateY(100%)",
      });
    }
  },
  [waitingForDriver],
);

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

      <div  className="h-screen w-screen ">
        <img
          className="h-full w-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSixb3-y80u_w_UbHzb1pmvRu2WYSWgweAG3w&s"
          alt=""
        />
      </div>

      <div className=" flex flex-col justify-end h-screen absolute top-0 w-ful">
        <div className="h-[30%] p-6 bg-white relative">
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
              onClick={(e) => setPanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Pick-up location"
            />
            <input
              value={destination}
              onClick={(e) => setPanelOpen(true)}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Destination location"
            />
          </form>
        </div>

        <div ref={panelRef} className=" bg-white  h-0">
          <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} />
        </div>
      </div>

      <div ref={vehiclePanelRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-full pt-12 px-3 py-10">
       <VehicalPanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>
      </div>

       <div ref={confirmRidePanelRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-full pt-12 px-3 py-6">
       <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound}/>
      </div>

      <div ref={vehicleFoundRef} className="fixed w-full z-10 bg-white bottom-0 translate-y-full pt-12 px-3 py-6">
       <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div ref={waitingForDriverRef} className="fixed w-full z-10 translate-y-full bg-white bottom-0  pt-12 px-3 py-6">
       <WaitingForDriver waitingForDriver={waitingForDriver} />
      </div>

       

    </div>
  );
};

export default Home;
