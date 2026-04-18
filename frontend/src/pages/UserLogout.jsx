import React,{useEffect, useRef} from 'react'
import axios from 'axios'
import { header } from 'express-validator'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
const hasLoggedOut = useRef(false);
     useEffect(() => {

        if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;
    
        axios.post(
            `${import.meta.env.VITE_BASE_URL}/users/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                navigate('/login')
                console.log("logged out")
            }
        }).catch((err) => {
            console.log(err)
        })

    }, [])



  return (
    <div>UserLogout</div>
  )
}

export default UserLogout