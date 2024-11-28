import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


export default function Dashpost() {

  /* call user information from react-redux */
  const { Currentuser } = useSelector((state) => state.user)

  /* call statements to Get and delete Post functions */

  const [userPost, setUserPost] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [success, setSuccess] = useState(null)
  const [failure, setFailure] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  /* Get the posts of a particular user */
     useEffect (() => {
      const pagepost = async () => {
      try {
          const res = await fetch(`api/post/getposts?userId=${Currentuser._id}`)
          const data = await res.json()
            if(res.ok){
              setUserPost(data.posts)
              if(data.posts.length < 9) {
                 setShowMore(false)
              }
            }
       }
       catch (error) {
        console.log(error.message)
      };
    };
      if(Currentuser.isAdmin){
        pagepost();
      }
     }, [Currentuser._id])

/* create a fontion for the showmore option
and assign it functionality */

     const HandleShowMore = async () => {
      const startIndex = userPost.length;
      try {
        const res = await fetch(`api/post/getposts?userId=${Currentuser._id}&startIndex=${startIndex}`)
         const data = await res.json();
         if(res.ok) {
           setUserPost((prev) => [...prev, ...data.posts])
             if(data.posts.length < 9) {
              setShowMore(false)
             }
            }
      } catch (error) {
        console.log(error.message)
      }
     }

     /* Function to delete Post of a given user */
     const handleDeletePost = async () =>{
      setShowModal(false)
      try {
        const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${Currentuser._id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
       if (!res.ok){
        setFailure(data.message)
       } else {
        setSuccess('Post deleted Successfully')
        setUserPost((prev) =>
         prev.filter((post) => post._id !== postIdToDelete ))
       }
     }catch(error){
       setFailure("Post can't be deleted")
       
     }
  }

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar sm:scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-500'>
       { 
        /* Show a table and content if logged in user is an Admin and the post length is 
        greater than zero */
        Currentuser.isAdmin &&  userPost.length > 0 ? (
         <>
         <Table hoverable className='shadow-md'>
           <Table.Head>
              <Table.HeadCell>
                Date Updated
              </Table.HeadCell>
              <Table.HeadCell>
                Post Image
              </Table.HeadCell>
              <Table.HeadCell>
                Post Title
              </Table.HeadCell>
              <Table.HeadCell>
                Category
              </Table.HeadCell>
              <Table.HeadCell>
                Delete
              </Table.HeadCell>
              <Table.HeadCell>
                <span >Edit</span>
              </Table.HeadCell>
           </Table.Head>
           {
            /* call the post from the function and display it 
            content in table */
             userPost.map((post) => (
               <Table.Body className='divide-y' key={post._id}>
                 <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                   <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                   <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                       {
                        <img src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'/>

                       }
                    </Link>
                   </Table.Cell>
                   <Table.Cell>
                      <Link className='font-medium text-gray-500 dark:text-white'  to={`/post/${post.slug}`}>
                      {post.title}
                      </Link>
                    </Table.Cell>
                   <Table.Cell>{post.category}</Table.Cell>
                   <Table.Cell>
                      <span onClick={() =>{
                        setShowModal(true)
                        setPostIdToDelete(post._id)
                      }} className='text-red-500 font-semibold hover:cursor-pointer'>
                          Delete
                      </span>
                   </Table.Cell>
                   <Table.Cell>
                   
                  { /* Edit post redirectory route to edit post page */}
                      <Link to={`/update-post/${post._id}`}>
                        <span className='text-teal-400 font-semibold'>
                          Edit
                        </span>
                      </Link>
                    </Table.Cell>

                 </Table.Row>
               </Table.Body>
             ))
           }
         </Table>
         {/* Show the show more option */}
         {
            showMore && (
              <button onClick={HandleShowMore} className=' w-full text-teal-500 self-center text-sm py-7'>
                 Show more
              </button>
            )
         }
         </>
       ):(

        /* the else statement if the are no post for this use it returns
        the folowing Result */
         <p>You have no post yet</p>
       )}

       {/* this is to show the modal imported from
       flowbite-react to ask the user if he want's to delete his post */}
      <Modal show={showModal} 
              onClose={() => setShowModal(false)} 
              popup size ='md' >
                <Modal.Header />
                  <Modal.Body>
                    <div className='text-center'>
                      <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                      dark:text-gray-200 mb-4 mx-auto' />
                      <h3 className='mb-5 text-lg text-gray-500
                      dark:text-gray-400'>
                        Do you want to delete this post
                        </h3>
                        <div className='flex justify-center gap-4'>
                          <Button color='failure' 
                          onClick={handleDeletePost}>
                            Yes, I'm sure
                            </Button>
                            <Button color='success' onClick={() => setShowModal(false)}>
                            No, Cancel
                            </Button>
                        </div>
                    </div>
                  </Modal.Body>
              </Modal>
              {
                /* and alert message from flowbite which confirms
                 the user that post has been deleted  */
                success && (
                  <Alert className='w-50 h-10 m-auto text-center'>{success}</Alert>
                )
              }
    </div>
  )
}