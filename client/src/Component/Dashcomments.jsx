import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function Dashcomments() {

   /* call logged in user from react-redux */ 
   const { Currentuser } = useSelector((state) => state.user)

   /* call statements form getting user and showmore option */ 
   const [comments, setComments] = useState([])
   const [showMore, setShowMore] = useState(true)
   const [success, setSuccess] = useState(null)
   const [failure, setFailure] = useState(null)
   const [showModal, setShowModal] = useState(false)
   const [commentToDelete, setCommentToDelete] = useState('')
  
   /* function to get users */ 
      useEffect (() => {
       const getcomments = async () => {
       try {
           const res = await fetch(`/api/comment/getcomments`)
           const data = await res.json()
             if(res.ok){
               setComments(data.comments)
             }
        }
        catch (error) {
         console.log(error.message)
       };
     };
       if(Currentuser.isAdmin){
         getcomments();
       }
      }, [Currentuser._id]);

      
      /*function for the showmore option */ 
      
      /* function for the delete user */ 
      const handleDeleteComment= async () =>{
       setShowModal(false)
       try {
         const res = await fetch(`/api/comment/deletecomment/${commentToDelete}`, {
           method: 'DELETE'
         });
         const data = await res.json();
        if (!res.ok){
         setFailure(data.message)
        } else {
         setSuccess('Comment deleted Successfully')
         setComments((prev) =>
          prev.filter((comment) => comment._id !== commentToDelete ))
        }
      }catch(error){
        setFailure("Comment can't be deleted")
        
      }
   }
 
   return (
     /* call table with condition if user is admin and if 
     users length greater zero */ 
     <div className=' w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar sm:scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-500'>
        { Currentuser.isAdmin &&  comments.length > 0 ? (
          <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
               <Table.HeadCell>
                 Updates
               </Table.HeadCell>
               <Table.HeadCell>
                 Comment Content
               </Table.HeadCell>
               <Table.HeadCell>
                 User
               </Table.HeadCell>
               <Table.HeadCell>
                Number of Like
               </Table.HeadCell>
               <Table.HeadCell>
                 Delete
               </Table.HeadCell>
            </Table.Head>
            {
             /* call map function to call out the user informations
              in the DB collections */ 
              comments.map((comment) => (
                <Table.Body className='divide-y' key={comment._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                        {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                        {comment.userId.username}
                    </Table.Cell>
                    <Table.Cell> {comment.numberOfLikes} </Table.Cell>
                    <Table.Cell>
                       <span 
                       /* delete button to delete user */ 
                       onClick={() =>{
                         setShowModal(true)
                         setCommentToDelete(comment._id)
                       }} className='text-red-500 font-semibold hover:cursor-pointer'>
                           Delete
                       </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            }
          </Table>
          </>
        ):(
          <p>You have no Comments yet</p>
        )}
 
       { /* call the modal from flowbite to be sure if you want to delete a
       given user in DB */ }
       {
         Currentuser.isAdmin && (
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
                         Do you want to delete this Comment
                         </h3>
                         <div className='flex justify-center gap-4'>
                           <Button color='failure' 
                           onClick={handleDeleteComment}>
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