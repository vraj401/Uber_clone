import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import "remixicon/fonts/remixicon.css"

const RazorpayPage = () => {
  const navigate = useNavigate()
  const { ride } = useContext(UserContext)
  const [animate] = useState(true)

  const handleHomeClick = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-gray-900 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          
          {/* Header with Gradient */}
          <div className="bg-linear-to-r from-green-400 to-green-600 p-8 text-center">
            {/* Animated Checkmark */}
            <div className={`flex justify-center mb-4 transform transition-all duration-700 ${animate ? 'scale-100' : 'scale-0'}`}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-500 text-5xl"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mt-4">Thank You!</h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-center text-gray-700 text-lg font-semibold mb-2">
              Ride Completed Successfully
            </p>
            <p className="text-center text-gray-500 mb-6">
              We hope you enjoyed your journey with Uber
            </p>

            {/* Ride Details */}
            {ride && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <i className="ri-map-pin-line mr-2 text-green-500"></i>
                    Pickup
                  </span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {ride.pickup?.substring(0, 30)}...
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <i className="ri-map-pin-fill mr-2 text-red-500"></i>
                    Destination
                  </span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {ride.destination?.substring(0, 30)}...
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <i className="ri-time-line mr-2 text-blue-500"></i>
                    Duration
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {ride.duration ? `${Math.round(ride.duration / 60)} min` : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Home Button */}
            <button
              onClick={handleHomeClick}
              className="w-full bg-linear-to-r from-black to-gray-800 text-white py-4 rounded-2xl font-bold text-lg hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
            >
              <i className="ri-home-line group-hover:animate-bounce"></i>
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            <i className="ri-shield-check-line text-green-400 mr-1"></i>
            Your ride details have been saved
          </p>
        </div>
      </div>
    </div>
  )
}

export default RazorpayPage