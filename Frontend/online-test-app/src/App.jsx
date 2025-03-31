import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Home from './Pages/Home/Home'
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard'
import TestPage from './Pages/TestPage/TestPage'
import Result from './Pages/Result/Result'

const App = () => {
  return (   
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/test' element={<TestPage/>}/>
      <Route path='/result' element={<Result/>}/>
    </Routes>
    
   
  )
}

export default App