import React from 'react'

// {
//     "_id": "69ec570e7ad4288e82449342",
//     "user": {
//         "fullname": {
//             "firstname": "test",
//             "lastname": "test"
//         },
//         "_id": "69e72d6636ee5b3ab770d73f",
//         "email": "test@test.com",
//         "password": "$2b$10$qI1ca11zd9WOx18Xmdubpee/9looJWM7fbG26t6qoEvY.ERQQnBXu",
//         "__v": 0,
//         "socketId": "yptr7rcI4HLWa7RWAACJ"
//     },
//     "pickup": "456 Elm St, Springfield",
//     "destination": "101 Pine St, Springfield",
//     "fare": 506,
//     "status": "pending",
//     "createdAt": "2026-04-25T05:54:22.759Z",
//     "updatedAt": "2026-04-25T05:54:22.759Z",
//     "__v": 0
// }

const RidePopUp = (props) => {
  return (
    <div>
        
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>

           <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                   <img className='h-12 w-10 rounded-full object-cover ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                   <h2 className='text-xl font-medium'> {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{props.ride?.distance} KM</h5>
           </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-gray-300 border-b-2 '>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-300'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
               <div className='flex mt-5 w-full items-center justify-between'>

                <button onClick={() => {
                  
                props.setRidePopupPanel(false)
            

                }} className=' bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg'>Ignore</button>

                 <button onClick={() => {

                    props.setConfirmRidePopupPanel(true)
                    props.setRidePopupPanel(false)
                    props.rideAcceptHandler(props.ride._id)

                
                }} className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Accept</button>

                
               </div>
            </div>

            </div>

    
  )
}

export default RidePopUp