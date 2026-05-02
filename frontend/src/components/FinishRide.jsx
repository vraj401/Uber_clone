import React from 'react'
import { Link } from 'react-router-dom'
import { SocketContext } from "../context/SocketContext";
import { useContext } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
    const {socket} = useContext(SocketContext);
    const {ride} = useContext(CaptainDataContext)
    const navigate = useNavigate()

    const completeRideHandler = async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/ride-completed`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    rideId: ride._id
                })
            })

            const data = await response.json();
            if(response.status === 200){
                socket.emit("ride-completed", data.ride);
                alert("Ride marked as completed! Redirecting to home page.");
                navigate("/captain-home");
            } else {
                alert("Failed to complete the ride. Please try again.");
            }
        } catch (error) {
            console.error("Error completing the ride:", error);
            alert("An error occurred while completing the ride. Please try again.");
        }
    }


  
  
    return (
   <div>
        
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish this ride</h3>

           <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                   <img className='h-12 w-10 rounded-full object-cover ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                   <h2 className='text-xl font-medium'>Harsh Patel</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
           </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-gray-300 border-b-2 '>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Bliss PG</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-300'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Bus stand</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹118</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>

                
                <div className='mt-6 w-full'>
                 
                        <button onClick={completeRideHandler} className='text-lg w-full flex justify-center mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>Finish Ride</button>
                        
                    <p className=' mt-10 text-xs'>Click on the finish ride button if you have completed the payment.</p>
                </div>
            </div>

            </div>
  )
}

export default FinishRide