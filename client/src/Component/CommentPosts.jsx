import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaThumbsUp } from 'react-icons/fa'
import {Button, Modal, Textarea} from 'flowbite-react'
import moment from 'moment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentPosts({comment, onLike, onEdit, onDelete}) {

    /* call user logged in from react redux */
    const {Currentuser} = useSelector(state => state.user)

  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(false)
  const [showModal, setShowModal] = useState(false)

   useEffect(() => {

       const getUser = async () => {
        try {
            const res = await fetch(`/api/user/${comment.userId}`)
            const data = await res.json()
            if(res.ok) {
                setUser(data);
            }
        } catch (error) {
            console.log(error.message)
        }
       } 
       getUser();
   }, [comment])

   const handleEdit = async () => {
      setIsEditing(true)
      setEditedContent(comment.content)
   }

   const handleSave = async () => {
    try {  
      const res = await fetch(`/api/comment/editcomment/${comment._id}`,{
         method: 'PUT',
         headers: {
          'Content-type' : 'application/json'
         },
         body: JSON.stringify({
          content: editedContent
         })
      });
      if(res.ok) {
        setIsEditing(false)
        onEdit(comment, editedContent)
      }
    } catch (error) {
       console.log(error.message)
    }
}

const handleDeleteComment = async () => {

}
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-xs'>
       <div className='flex-shrink-0 mr-3'>
         <img className='w-10 h-10 rounded-full bg-blue-300' src={user.profilePicture} alt={user.username} /> 
       </div>
       <div className='flex-1'>
          <div className='flex items-center mb-2'>
            <span className='font-bold mr-1 text-xs truncate'>
               {user ? `@${user.username}` : 'anonymous user' }
               <span className='ml-1 text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
            </span>
          </div>
            { isEditing ? (
              <div className=''>
                <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className='flex justify-end text-xs gap-2'>
                <Button type='submit' 
                className='mt-1'
                size='sm'
                gradientDuoTone='pinkToOrange'
                onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                onClick={() => setIsEditing(false)}
                type='submit' 
                className='mt-1'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline>
                  Cancel
                </Button>
                </div>
              </div>
              ): (
                <>
              <p className='font-semibold text-gray-500 mb-2'>
            {comment.content}
            </p>
            <div className='flex items-center'>
              <button type='button' onClick={() => onLike(comment._id)} 
              className={`text-gray-500 hover:text-blue-500
              ${
                Currentuser && comment.likes.includes(Currentuser._id)
                && "!text-blue-500"
              }`}>
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text=gray-500 ml-1'>
              {
                comment.numberOfLikes > 0 && comment.numberOfLikes + " " +
                (comment.numberOfLikes === 1 ? 'Like' : 'Likes')
              }
              </p>
              {
                Currentuser && [Currentuser._id === comment.userId] &&
                (
                  <>
                    <button type='button' className='ml-1 text-gray-500 hover:text-blue-500'
                    onClick={handleEdit}>
                      Edit
                    </button>
                    <button 
                      className='ml-1 text-gray-500'
                      onClick={() => onDelete(comment._id)}>
                      Delete
                    </button>
                  </>
                )
              }
          </div>
                </>
            ) 
          }
          
       </div>
       
    </div>
  )
}
