import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
   const { Currentuser } = useSelector((state) => state.user)
   return Currentuser ? <Outlet /> : <Navigate to='/signin' />
}
