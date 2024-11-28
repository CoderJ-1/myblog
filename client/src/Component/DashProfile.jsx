import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteUserFailure, deleteUserStart, deleteUserSucess, signOutSucess, updateFailure, updateStart, updateSucess } from '../Redux/user/userSlice'

export default function DashProfile() {

  /* call user logged in from react redux */
    const { Currentuser, error, loading } = useSelector(state => state.user)
    
    /* call statements for the upload image and update profile */
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null)
    const [imageFileUploadProgressError, setimageFileUploadProgressError] = useState(null)
    const [formData, setFormData] = useState({})
    const [updateError, setUpdateError] = useState(null)
    const [showWindow, setShowWindow] = useState(false)
    const [updateUserSucess, setUpdateUserSucess] = useState(null)
    const dispatch = useDispatch()
    const filePickerRef = useRef();

    /* call function to change profile image */
    const handleIimageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file));
        }
    }
    useEffect(() => {
        if(imageFile) {
            uploadImage();
        }
    }, [imageFile])
    /* upload image from local storage to firebase storage */
    const uploadImage = async () => {
        // service firebase.storage {
            // match /b/{bucket}/o {
             // match /{allPaths=**} {
              //  allow read;
              //  allow write: if 
             //   request.resource.size < 2 * 1024 * 1024 &&
              //  request.resource.contentType.matches('image/.*')
          //    }
        //    }
       //   }
       setimageFileUploadProgressError(null)
       const storage = getStorage(app);
       const filename = new Date().getTime() + imageFile.name;
       const storageRef = ref(storage, filename)
       const uploadTask = uploadBytesResumable(storageRef, imageFile);
       uploadTask.on(
        'state_changed',
        (snapshot) => {

          /* Get the transfer spped in bytes and convert to percentage */
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0))

        },
        error => {
          /* call error if image couldnot upload */
            setimageFileUploadProgressError('Browser Could not upload image')
            setImageFileUploadProgress(null)
            setImageFile(null)
            setImageFileUrl(null)

        }, () => {

          /* get url from firebase storage and assign to DB attribut */
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL)
                setFormData({...formData, profilePicture: downloadURL})
            })
        }
       )
    }
    /* call function for browser data collection */
    const handleChange = (e) =>{
      setFormData({ ...formData, [e.target.id]: e.target.value })
    };

    /* call function to update user from DB */

    const Updateuser = async (e) => {
      e.preventDefault()
      if(Object.keys(formData).length === 0) {
        setUpdateError('No change Occur')
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${Currentuser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
        const data = await res.json();
       if (!res.ok){
        dispatch(updateFailure(data.message))
       } else {
        dispatch(updateSucess(data))
        setUpdateUserSucess('User profile updated Successfully')
       }
      } catch (error) {
        dispatch(updateFailure(error.message))
      }
    }

    /* call function the user to delete his account */
    const handleDeleteUser = async () => {
      setShowWindow(false);
      try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/user/delete/${Currentuser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
       if (!res.ok){
        dispatch(deleteUserFailure(data.message))
       } else {
        dispatch(deleteUserSucess(data))
        setUpdateUserSucess('User profile Deleted Successfully')
       }
        
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }

    /* call function for user to signOut  */
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
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-5' onSubmit={Updateuser}>
        <input type='file' accept='image/*'  onChange={handleIimageChange} ref={filePickerRef} hidden/>
        
        {/* get image upload from loacal storage */}
        <div 
         className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
         onClick={() => filePickerRef.current.click()}>
            { 
             /* call the upload progress function from above */ 
              imageFileUploadProgress && (
                    <CircularProgressbar value ={imageFileUploadProgress || 0} text ={`${imageFileUploadProgress}%`} 
                      strokeWidth={5}
                      styles={{
                        root:{
                         width: '100%',
                         height: '100%',
                         position: 'absolute',
                         top: 0,
                         left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, 
                            ${imageFileUploadProgress / 100})` ,
                      }
                    }}
                    />
                )
            }
            {/* use user current ProfilePicture or the image uploaded 
            from local storage */}
           <img src={imageFileUrl || Currentuser.profilePicture} 
           alt='user' className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} 
           />
        </div>
        {
            imageFileUploadProgressError &&
          <Alert color='failure'>{imageFileUploadProgressError}</Alert>
        }
        {/* form for user update with user details given 
        as their defualt values  */}
        <TextInput type='text' 
        id='username'
        placeholder='username'
        defaultValue={Currentuser.username} 
        onChange={handleChange}
        />
        <TextInput 
        type='email' 
        id='email'
        placeholder='email'
        defaultValue={Currentuser.email} 
        onChange={handleChange}
        />
        <TextInput 
        type='password' 
        id='password'
        placeholder='password'
        onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading}>
           { loading ? 'loading...... ' : 'Update'}
        </Button>
        {
          Currentuser.isAdmin && (
            <Link to={'/create-post'}>
            <Button
            type='button'
            gradientDuoTone='purpleToPink'
            className='w-full'>
              Create a Post
            </Button>
            </Link>
          )
        }
        </form>
        <div className='text-red-500 flex justify-between mt-2'>
            <span className='cursor-pointer' onClick={() =>setShowWindow(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignOut}>SignOut</span>
        </div>
        {/* Alert Messages from flowbite with response from 
        the update function */}
        {
          updateUserSucess && <Alert color='success'>{updateUserSucess}</Alert>
        }
        {
          updateError && <Alert color='failure'>{updateError}</Alert>
        }
        {
          error && <Alert color='failure'>{error}</Alert>
        }
        {/* call Modal from flowbite to ask user if he/she is 
        sure to delete his account */}
        <Modal show={showWindow} 
        onClose={() => setShowWindow(false)} 
        popup size ='md' >
          <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                 <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                 dark:text-gray-200 mb-4 mx-auto' />
                 <h3 className='mb-5 text-lg text-gray-500
                 dark:text-gray-400'>
                  Do you want to delete your account
                  </h3>
                  <div className='flex justify-center gap-4'>
                     <Button color='failure' 
                     onClick={handleDeleteUser}>
                      Yes, I'm sure
                      </Button>
                      <Button color='success' onClick={() => setShowWindow(false)}>
                       No, Cancel
                      </Button>
                  </div>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
