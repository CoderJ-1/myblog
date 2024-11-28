import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function DashUser() {

   /* call logged in user from react-redux */ 
  const { Currentuser } = useSelector((state) => state.user)

  /* call statements form getting user and showmore option */ 
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [success, setSuccess] = useState(null)
  const [failure, setFailure] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')
 
  /* function to get users */ 
     useEffect (() => {
      const getusers = async () => {
      try {
          const res = await fetch(`api/user/getusers`)
          const data = await res.json()
            if(res.ok){
              setUsers(data.users)
              if(data.users.length < 9) {
                 setShowMore(false)
              }
            }
       }
       catch (error) {
        console.log(error.message)
      };
    };
      if(Currentuser.isAdmin){
        getusers();
      }
     }, [Currentuser._id])

     /*function for the showmore option */ 
     const HandleShowMore = async () => {
      const startIndex = users.length;
      try {
        const res = await fetch(`api/user/getusers?startIndex=${startIndex}`)
         const data = await res.json();
         if(res.ok) {
           setUsers((prev) => [...prev, ...data.users])
             if(data.users.length < 9) {
              setShowMore(false)
             }
            }
      } catch (error) {
        console.log(error.message)
      }
     }
     
     /* function for the delete user */ 
     const handleDeleteUser = async () =>{
      setShowModal(false)
      try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
          method: 'DELETE'
        });
        const data = await res.json();
       if (!res.ok){
        setFailure(data.message)
       } else {
        setSuccess('Post deleted Successfully')
        setUsers((prev) =>
         prev.filter((user) => user._id !== userIdToDelete ))
       }
     }catch(error){
       setFailure("User can't be deleted")
       
     }
  }

  return (
    /* call table with condition if user is admin and if 
    users length greater zero */ 
    <div className=' w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar sm:scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-500'>
       { Currentuser.isAdmin &&  users.length > 0 ? (
         <>
         <Table hoverable className='shadow-md'>
           <Table.Head>
              <Table.HeadCell>
                Updates
              </Table.HeadCell>
              <Table.HeadCell>
                User Image
              </Table.HeadCell>
              <Table.HeadCell>
                Username
              </Table.HeadCell>
              <Table.HeadCell>
                Email
              </Table.HeadCell>
              <Table.HeadCell>
                Admin
              </Table.HeadCell>
              <Table.HeadCell>
                Delete
              </Table.HeadCell>
           </Table.Head>
           {
            /* call map function to call out the user informations
             in the DB collections */ 
             users.map((user) => (
               <Table.Body className='divide-y' key={user._id}>
                 <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                   <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                   <Table.Cell>
                       {
                        <img src={user.profilePicture}
                        alt={user.username}
                        className=' rounded-full w-10 h-10 object-cover bg-gray-500'/>

                       }
                   </Table.Cell>
                   <Table.Cell> {user.username} </Table.Cell>
                    <Table.Cell> {user.email} </Table.Cell>
                   <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-400' />) : (<FaTimes className='text-red-500' />) }</Table.Cell>
                   <Table.Cell>
                      <span 
                      /* delete button to delete user */ 
                      onClick={() =>{
                        setShowModal(true)
                        setUserIdToDelete(user._id)
                      }} className='text-red-500 font-semibold hover:cursor-pointer'>
                          Delete
                      </span>
                   </Table.Cell>
                 </Table.Row>
               </Table.Body>
             ))
           }
         </Table>
         {
          /* call the showmore option function */ 
            showMore && (
              <button onClick={HandleShowMore} className=' w-full text-teal-500 self-center text-sm py-7'>
                 Show more
              </button>
            )
         }
         </>
       ):(
         <p>You have no User yet</p>
       )}

      { /* call the modal from flowbite to be sure if you want to delete a
      given user in DB */ }
      {
        Currentuser.isAble && (
          <Modal show={showModal} 
              onClose={() => setShowModal(false)} 
              popup size ='md'>
                <Modal.Header />
                  <Modal.Body>
                    <div className='text-center'>
                      <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                      dark:text-gray-200 mb-4 mx-auto' />
                      <h3 className='mb-5 text-lg text-gray-500
                      dark:text-gray-400'>
                        Do you want to delete this user
                        </h3>
                        <div className='flex justify-center gap-4'>
                          <Button color='failure' 
                          onClick={handleDeleteUser}>
                            Yes, I'm sure
                            </Button>
                            <Button color='success' onClick={() => setShowModal(false)}>
                            No, Cancel
                            </Button>
                        </div>
                    </div>
                  </Modal.Body>
              </Modal>
        )
      }
              {
                success && (
                  <Alert className='w-50 h-10 m-auto text-center'>{success}</Alert>
                )
              }
    </div>
  )
}