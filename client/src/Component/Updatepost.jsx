import React, { useEffect, useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import { useSelector, useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function UpdatePost() {

  const { Currentuser } = useSelector((state) => state.user)
  const [file, setFile] = useState(null)
  const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null)
  const [formData, setFormData] = useState({})
  const [postError, setPostError] = useState(null)
  const [postSuccess, setPostSuccess] = useState(null)
  const [imageFileUploadError, setimageFileUploadError] = useState(null)

  const {postId} = useParams();

  useEffect(() => {
    try {
        const query = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`)
        const data = await res.json();
        if(!res.ok) {
            console.log(data.message)
        }if(res.ok){
             setPostError(null)
             setFormData(data.posts[0])
        }
      }
        query();
    } catch (error) {
        console.log(error.message)
    }
  }, [postId])

  const handleUpload = async () =>{
    try {
      if(!file){
        setimageFileUploadError('Please select an image')
        return;
      }
      setimageFileUploadError(null)
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

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${Currentuser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
     if (!res.ok){
       setPostError(data.message);
    }
     if(res.ok) {
      setPostSuccess('Article Updated Sucessfully') 
      setPostError(null)
     }
    } catch (error) {
      setPostError(error.message)
      setPostSuccess(null)
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
         <div className=' flex gap-4 sm:flew-row justify-between'>
           <TextInput type='text' 
           placeholder='Title' 
           required 
           id='title'
           className='flex-1'
           onChange={(e) => 
           setFormData({...formData, title: e.target.value})}
           value={formData.title}
           />
           <Select 
            className='text-8xl'
            onChange={(e) => 
            setFormData({...formData, category: e.target.value})}
            value={formData.category}
            >
             <option value='uncategorized'>Select a categories</option>
             <option value='javascript'>Javascript</option>
             <option value='Reactjs'>Reactjs</option>
             <option value='Nextjs'>Next.js</option>
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
         value={formData.content}
         onChange={(value) => 
          setFormData({...formData, content:value})
          }/>
            <Button type='submit' gradientDuoTone='purpleToPink' outline>
               Update Post
            </Button>
            {
              postSuccess && <Alert color='success'>{postSuccess}</Alert>
            }
            {
              postError && <Alert color='failure'>{postError}</Alert>
            }
      </form>
    </div>
  )
}