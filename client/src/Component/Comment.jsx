import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CommentPosts from './CommentPosts'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Comment({ postId }) {
  
  /* call user logged in from react redux */
  const {Currentuser} = useSelector(state => state.user)

  const navigate = useNavigate()

  const [comment, setComment] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [comments, setComments] = useState([])
  const [commentDelete, setCommentDelete] = useState(null)

  /* Post Comments in DB */

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const res = await fetch('/api/comment/create',{
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            postId, 
            content:comment, 
            userId: Currentuser._id})
        })
          const data = await res.json()
             if(res.ok) {
               setComment('');
               setComments([data, ...comments])
               setError(false)
               setSuccess('Comment added')
             }
             if(!res.ok) {
               setError('Comment not added')
             }
       } catch (error) {
          setError('Server Error')
       }
    }

    /* Get Comment from DB */
    
    useEffect(() =>{
      const getcomment = async () => {
        try {
          const res = await fetch(`/api/comment/getcomments/${postId}`)
          if(res.ok){
            const data = await res.json()
            setComments(data);
          }
        } catch (error) {
          console.log(error.message)
        }
      }
       getcomment()
    }, [postId])

    const HandleLike = async (commentId) => {
      try {
        if(!Currentuser) {
          navigate('/signin')
          return;
        }
        const res = await fetch(`/api/comment/likecomment/${commentId}`,
        {
          method: 'PUT',
        })
        if(res.ok) {
          const data = await res.json()
          setComments(comments.map((comment) => 
             comment._id === commentId ? {
              ...comment,
              likes: data.likes,
              numberOfLikes: data.likes.length /* also numberOfLikes: data.numberOfLikes  */
             } : comment
          ))
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const handleEdit = async (comment, editedContent) => {
      setComments(
        comments.map((c) => 
      c._id === comment._id ? {...c, content: editedContent} : c )
      )
    }

    const handleDeleteComment = async (commentId) => {
      setShowModal(false)
      setSuccess(false)
      setError(false)
      if(!Currentuser){
         navigate('/signin')
         return; 
      }
       const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: 'DELETE',
       })

       if(res.ok){
            setComments(comments.filter((comment) => comment._id !== commentId))
          }
       }
  return (
    <div className='mx-auto p-3 max-w-2xl'>
      { Currentuser ? (
        <div className='mt-3 flex items-center pb-1 gap-1 text-gray-500'>
             <p>Sign in as: </p>
             <img src={Currentuser.profilePicture} className='w-7 h-7 ml-1 mr-1 rounded-full' />
             <p className='text-cyan-600 hover:text-red-400'> {Currentuser.email}</p>
        </div>    
      ): (
        <div>
            <p>You must be signed in to comment.</p>
            <Link to='/signin'>
               <span className='text-red-500 hover:text-cyan-500 hover:underline'>Sign In</span>
            </Link>
        </div>
      )}
      {
        /* Get a comment form if there is a user signed in */
        Currentuser && (
          <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
             <Textarea
             placeholder='Add a comment'
             rows='3'
             maxLength='200'
             onChange={(e) => setComment(e.target.value)}
             value={comment}
              />
              <div className='text-gray-500 p-3 flex justify-between'>
                <p className='text-xs'>{200-comment.length} character remaining</p>
                <Button type='submit' className='justify-center' gradientDuoTone='purpleToBlue' outline>
                  Submit
                </Button>
              </div>
              {
                success &&
                 <Alert color='success'>{success}</Alert>}
              
              {
                error &&
                <Alert color='failure'>{error}</Alert>
              }
          </form>
          
        )
      }
      {
        /* Show user comments-- if user posted any comment!!! */

            comments.length === 0 ? (
              <p>No comment yet!</p>
            ): (
              <>
              <div className='text-sm my-5 flex items-center gap-1'>
              <p>Comments</p>
              <div className='border border-gray-500 py-1 px-2 rounded-sm'>
                  <p>{comments.length}</p>
              </div>
              </div>
                {
                  comments.map((comment) => (
                     <CommentPosts key={comment._id} 
                     comment={comment}
                     onLike={HandleLike}
                     onEdit={handleEdit}
                     onDelete={(commentId) => 
                     {
                      setShowModal(true)
                      setCommentDelete(commentId)
                     }}
                     />
                
                ))}
              </>
            )}

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
                        Do you want to delete this comment
                        </h3>
                        <div className='flex justify-center gap-4'>
                          <Button color='failure' 
                          onClick={() => handleDeleteComment(commentDelete)}>
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
    </div>
  )
}
