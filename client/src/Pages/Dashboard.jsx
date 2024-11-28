import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../Component/DashSidebar'
import DashProfile from '../Component/DashProfile'
import DashPost from '../Component/Dashpost'
import DashUser from '../Component/DashUser'
import DashComments from '../Component/Dashcomments'
import DashboardComponent from '../Component/DashboardComponent'

export default function Dashboard() {

  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search) 
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
       { tab === 'profile' && <DashProfile /> }
       { tab === 'posts' && <DashPost /> }
       {tab === 'users' && <DashUser /> }
       {tab === 'comments' && <DashComments /> }
       {tab === 'dashboard' && <DashboardComponent /> }
    </div>
  )
}
