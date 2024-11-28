import React, { useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {

    /* call statements for the CreatePost functions */

  const [file, setFile] = useState(null)
  const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null)
  const [formData, setFormData] = useState({})
  const [postError, setPostError] = useState(null)
  const [postSuccess, setPostSuccess] = useState(null)
  const [imageFileUploadError, setimageFileUploadError] = useState(null)
  
  /* Upload Image from local computer to firebase storage */
  
  const handleUpload = async () =>{
    try {
      if(!file){
        setimageFileUploadError('Please select an image')
        return;
      }
      setimageFileUploadError(null)
      /* call firebase storage and it components */
      const storage = getStorage(app);
       const filename = new Date().getTime() + '-'+ file.name;
       const storageRef = ref(storage, filename)
       const uploadTask = uploadBytesResumable(storageRef, file);
       uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0)) 
          },
        (error) =>{
          setimageFileUploadError('Image upload failed')
          setImageFileUploadProgress(null)
        },
        () => {

           /* get the url of the image from firebase storage and assign it to 
           Database Document Attribut*/

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             setImageFileUploadProgress(null);
             setimageFileUploadError(null);
             setFormData({...formData, image: downloadURL})
          })
        }
     )
    } catch (error) {
      setimageFileUploadError('Uploading......... failed')
      setImageFileUploadProgress(null)
      console.log(error);
    }
  }

  /* Create Post for users */

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
     if (!res.ok){
       setPostError(data.message);
    }
     if(res.ok) {
      setPostSuccess('Article pusblised Sucessfully') 
      setPostError(null)
     }
    } catch (error) {
      setPostError(error.message)
      setPostSuccess(null)
    }
  }

  return (

    /* post interface with the form and the values */
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create a Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        
         <div className=' flex gap-4 sm:flew-row justify-between'>
           <TextInput type='text' 
           placeholder='Title' 
           required 
           id='title'
           className='flex-1'
           onChange={(e) => 
           setFormData({...formData, title: e.target.value})
           }
           />
           <Select className='text-8xl'
           onChange={(e) => 
            setFormData({...formData, category: e.target.value})
            }>
             <option value='uncategorized'>Select a categories</option>
             <option value='Javascript'>Javascript</option>
             <option value='Reactjs'>Reactjs</option>
             <option value='Nextjs'>Nextjs</option>
           </Select>
         </div>
         <div className='flex gap-4  items-center justify-between border-4
         border-teal-500 border-dotted p-3'>
          <FileInput type='file'
          accept='image/*' 
          onChange={(e) => setFile(e.target.files[0])}/>
          <Button type='button' 
          gradientDuoTone='purpleToBlue' 
          size='sm' 
          onClick={handleUpload}
          disabled={imageFileUploadProgress}
          outline
          >
            {
              /* Assign This button for upload image */

              imageFileUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar 
                value={imageFileUploadProgress}
                text={`${imageFileUploadProgress || 0}%`} 
                />
              </div> ) : (
                'upload Image '
              )}
          </Button>
         </div>
         {
          imageFileUploadError && 
            <Alert color='failure'>{imageFileUploadError}</Alert>
         }
         { formData.image && (
          <img src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover' 
          />
         )}
         <ReactQuill 
         theme='snow'
         placeholder='Write your Content......' 
         required 
         className='h-72 mb-12'
         onChange={(value) => 
          setFormData({...formData, content: value})
          
          }/>
            <Button type='submit' gradientDuoTone='purpleToPink' outline>
               Publish
            </Button>
            {
              /* Alert for both sucess and error */
              postSuccess && <Alert color='success'>{postSuccess}</Alert>
            }
            {
              postError && <Alert color='failure'>{postError}</Alert>
            }
      </form>
    </div>
  )
}
