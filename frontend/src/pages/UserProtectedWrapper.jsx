
import React,{useState, useContext,useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const UserProtectedWrapper = ({
    children
}) => {

  const token = localStorage.getItem('token')
   const navigate = useNavigate()
   const { user, setUser } = useContext(UserContext)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            setUser(response.data.user)
            setIsLoading(false)
        }
    }).catch(error => {
        console.log(error)
        localStorage.removeItem('token')
        navigate('/login')

    }
)
}, [token, navigate])

if(isLoading){
    return <div>Loading...</div>
}

   return (<>
   {children}
   </>)

  
}

export default UserProtectedWrapper