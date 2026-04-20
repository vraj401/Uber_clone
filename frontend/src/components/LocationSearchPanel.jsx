import React from 'react'

const LocationSearchPanel = (props) => {

    const locations= [
        "11,ambikanagar-2,fulbaimata road,kapadwanj,gujarat",
        "12,ambikanagar-2,fulbaimata road,kapadwanj,gujarat",
        "13,ambikanagar-2,fulbaimata road,kapadwanj,gujarat",
        "14,ambikanagar-2,fulbaimata road,kapadwanj,gujarat"
        
    ]

  return (
    <div>


        {
            locations.map(function(ele,idx){
                return <div key={idx} onClick={()=> {
                    props.setVehiclePanel(true)
                    props.setPanelOpen(false)
                    }} className='flex gap-4  border-2  p-3 border-gray-100 active:border-black rounded-xl items-center justify-start pl-4 my-2'>
            <h2 className=' h-10 w-12 bg-[#eee] flex items-center justify-center rounded-full'>
                <i className="ri-map-pin-fill text-xl"></i>
            </h2>
                <h4 className='font-medium'>{ele}</h4>
        </div>

            })
        }
    

        
        
    </div>
  )
}

export default LocationSearchPanel