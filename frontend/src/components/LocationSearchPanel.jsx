import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField,pickup,destination ,setSuggestions}) => {

         const handleSuggestionClick = (suggestion) => {
            if (activeField === "pickup") {
                setPickup(suggestion.description);
            } else if (activeField === "destination") {
                setDestination(suggestion.description);
            }
        }

        var locations = suggestions.map(suggestion => suggestion.description);


// const locations = [
//     "123 Main St, Springfield",
//     "456 Elm St, Springfield",
//     "789 Oak St, Springfield",
//     "101 Pine St, Springfield",
//     "202 Maple St, Springfield"
// ]



  return (
    <div>
            {
                suggestions.map((elem, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{elem.description}</h4>
                    </div>
                ))
            }


        {/* {
            locations.map(function(ele,idx){
                return <div key={idx} onClick={()=> {
                    // handleSuggestionClick(suggestions[idx]);
            
                        if (activeField === "pickup") {
                            
                            setPickup(ele);
                        } else if (activeField === "destination") {
                            
                            setDestination(ele);
                        }

                    }} className='flex gap-4  border-2  p-3 border-gray-100 active:border-black rounded-xl items-center justify-start pl-4 my-2'>
            <h2 className=' h-10 w-12 bg-[#eee] flex items-center justify-center rounded-full'>
                <i className="ri-map-pin-fill text-xl"></i>
            </h2>
                <h4 className='font-medium'>{ele}</h4>
        </div>

            })
        } */}
    

        
        
    </div>
  )
}

export default LocationSearchPanel
