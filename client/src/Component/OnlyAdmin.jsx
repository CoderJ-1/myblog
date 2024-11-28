import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function OnlyAdmin() {
   const { Currentuser } = useSelector((state) => state.user)
   return Currentuser && Currentuser.isAdmin ? <Outlet /> : <Navigate to='/signin' />
}
