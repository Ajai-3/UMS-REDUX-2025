import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'


const App: React.FC = () => {
  return (
    <>
    <ToastContainer theme='dark' />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App