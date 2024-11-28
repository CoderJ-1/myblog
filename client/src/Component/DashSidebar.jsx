import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { useSelector, useDispatch } from 'react-redux'
import { BiBookAlt } from "react-icons/bi"
import { HiAnnotation, HiArrowSmLeft, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser, HiViewBoards } from 'react-icons/hi'
import { signOutSucess } from '../Redux/user/userSlice'

export default function DashSidebar() {

    const location = useLocation()
    const dispatch = useDispatch()

    /* call user logged in from react redux */
  const { Currentuser } = useSelector((state) => state.user)

  /* call tab statement and url params for tab pathway */
  const [tab, setTab] = useState('')
  useEffect(() =>{ 

    /* assignctab to the urlparams to creat it own path */
    const urlParams = new URLSearchParams(location.search) 
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])

  /* call signOut function for the sidebar */
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
     if (!res.ok){
       console.log(data.massage)
     } else {
       dispatch(signOutSucess())
     } 
    } catch (error) {
     console.log(error.message)
    }
  }

  
  return (
    /* call sidebar from flowbite*/
   <Sidebar className='w-full md:w-56 '>
    <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-3'>
        { 
               /* assign a tab url path for the post page */ 
              Currentuser.isAdmin && (
            <Link to='/dashboard?tab=dashboard'>
                <Sidebar.Item  active = { tab == 'dashboard' || !tab } 
                icon={ HiChartPie } 
                as='div'>
                   Dashboard
                </Sidebar.Item>
            </Link>
            ) }
            <Link to='/dashboard?tab=profile'>
                <Sidebar.Item 
                /* assign a tab url path for the profile page &&
                a condition for if user is an Admin label=Adlmin else label=user*/ 
                active ={ tab === 'profile' } 
                icon={ HiUser } label={Currentuser.isAdmin ? 'Admin' : 'User'}  
                labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
            </Link>
            { 
               /* assign a tab url path for the post page */ 
              Currentuser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
                <Sidebar.Item  active ={ tab === 'posts' } 
                icon={ BiBookAlt } 
                as='div'>
                    Post
                </Sidebar.Item>
            </Link>
            ) }
            { 
               /* assign a tab url path  for the Get users page */ 
              Currentuser.isAdmin && (
            <Link to='/dashboard?tab=users'>
                <Sidebar.Item  active ={ tab === 'users' } 
                icon={ HiOutlineUserGroup } 
                as='div'>
                    User
                </Sidebar.Item>
            </Link>
            ) }
            {Currentuser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
                <Sidebar.Item  active ={ tab === 'comments' } 
                icon={ HiAnnotation } 
                as='div'>
                    Comments
                </Sidebar.Item>
            </Link>
            ) }
            <Sidebar.Item  icon={ HiArrowSmLeft}  
            className='cursor-pointer'
            onClick={handleSignOut}>
                SignOut
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
   </Sidebar>
  )
}
