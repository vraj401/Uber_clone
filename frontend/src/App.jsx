import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import Userlogin from './pages/Userlogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup'
import CaptainLogin from './pages/CaptainLogin'
import UserLogout from './pages/UserLogout'
import Home from './pages/Home'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import CaptainHome from './pages/captainHome'
import CaptainProtectWrapper from './pages/captainProtectWrapper'
import Riding from './components/Riding'

const App = () => {
  return (
    <div >
     <Routes>
      
      <Route path='/' element={<Start/>} />
      <Route path='/signup' element={<UserSignup/>} />
      <Route path='/login' element={<Userlogin/>} />
      <Route path='/riding' element={<Riding/>} />
      <Route path='/captain-signup' element={<CaptainSignup/>} />
      <Route path='/captain-login' element={<CaptainLogin/>} />
      <Route path='/home' element={
        <UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>
      } />
    <Route path='/user/logout' element={
      <UserProtectedWrapper>
        <UserLogout/>
      </UserProtectedWrapper>
    } />

    <Route path='/captain-home' element={
      <CaptainProtectWrapper>
       <CaptainHome/>
      </CaptainProtectWrapper>
      
    } />
     </Routes>
    </div>
  )
}

export default App
