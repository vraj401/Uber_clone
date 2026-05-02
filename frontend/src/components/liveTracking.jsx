import React, { useState, useEffect, useContext, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { SocketContext } from '../context/SocketContext';

const LiveTracking = ({ userLocation, destinationLocation, driverLocation, rideStatus }) => {
  const { socket } = useContext(SocketContext);
  const [currentLocation, setCurrentLocation] = useState(userLocation || { lat: 23.0225, lng: 72.5714 }); // Default to Ahmedabad
  const [driverPos, setDriverPos] = useState(driverLocation || { lat: 23.0225, lng: 72.5714 });
  const [destination, setDestination] = useState(destinationLocation || { lat: 23.1815, lng: 72.6369 });
  const [routePath, setRoutePath] = useState([]);
  const [mapCenter, setMapCenter] = useState(currentLocation);
  const mapRef = useRef(null);

  // Google Maps API Key - Add your API key here
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  // Map container styles
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
  };

  const mapOptions = {
    zoom: 16,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };

  // Get current user location
  useEffect(() => {
    if (navigator.geolocation) {
      // Function to get and update location
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { lat: latitude, lng: longitude };
            setCurrentLocation(newLocation);
            setMapCenter(newLocation);

            // Emit location update to server
            if (socket) {
              socket.emit('update-location-user', {
                lat: latitude,
                lng: longitude,
              });
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      };

      // Get location immediately
      updateLocation();

      // Set up interval to update location every 10 seconds
      const intervalId = setInterval(updateLocation, 10000);

      // Cleanup interval
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [socket]);

  // Listen for driver location updates
  useEffect(() => {
    if (!socket) return;

    socket.on('driver-location-update', (data) => {
      if (data.lat && data.lng) {
        setDriverPos({ lat: data.lat, lng: data.lng });
      }
    });

    socket.on('route-update', (data) => {
      if (data.path && Array.isArray(data.path)) {
        setRoutePath(data.path);
      }
    });

    return () => {
      socket.off('driver-location-update');
      socket.off('route-update');
    };
  }, [socket]);

  // Center map on current user location
  const handleCenterMap = () => {
    setMapCenter(currentLocation);
  };

  // Custom marker icon for user
  const userMarkerIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 },
  };

  // Custom marker icon for driver
  const driverMarkerIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 },
  };

  // Custom marker icon for destination
  const destinationMarkerIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 },
  };

  return (
    <div className="relative w-full h-full">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          ref={mapRef}
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapOptions.zoom}
          options={mapOptions}
        >
          {/* User Location Marker */}
          <Marker
            position={currentLocation}
            title="Your Location"
            icon={userMarkerIcon}
            animation={window.google?.maps?.Animation?.BOUNCE}
          />

          {/* Driver Location Marker */}
          {driverPos && (
            <Marker
              position={driverPos}
              title="Driver Location"
              icon={driverMarkerIcon}
            />
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker
              position={destination}
              title="Destination"
              icon={destinationMarkerIcon}
            />
          )}

          {/* Route Path Line */}
          {routePath.length > 1 ? (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#4F46E5',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          ) : driverPos && destination ? (
            <Polyline
              path={[driverPos, destination]}
              options={{
                strokeColor: '#4F46E5',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          ) : null}

          {/* User to Driver Line */}
          {driverPos && currentLocation && (
            <Polyline
              path={[currentLocation, driverPos]}
              options={{
                strokeColor: '#FF6B6B',
                strokeOpacity: 0.5,
                strokeWeight: 2,
                strokeDasharray: [5, 5],
                geodesic: true,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Center Map Button */}
      <button
        onClick={handleCenterMap}
        className="absolute bottom-4 right-4 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
        title="Center on your location"
      >
        <i className="ri-map-pin-current-fill text-lg"></i>
      </button>

      {/* Location Info Card */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Your Location</p>
            <p className="text-sm font-semibold text-gray-800">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          </div>
          {driverPos && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Driver Location</p>
              <p className="text-sm font-semibold text-gray-800">
                {driverPos.lat.toFixed(4)}, {driverPos.lng.toFixed(4)}
              </p>
            </div>
          )}
          {destination && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Destination</p>
              <p className="text-sm font-semibold text-gray-800">
                {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
              </p>
            </div>
          )}
          {rideStatus && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <p className="text-sm font-semibold text-green-600 capitalize">{rideStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
