import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../Component/CallToAction';
import PostCard from '../Component/PostCard';

export default function Home() {

  const [recentPost, setRecentPost] = useState()

  useEffect(() => { 
    const fetchRecent = async () => {
     const res = await fetch(`/api/post/getposts?limit=6`)
     const data = await res.json()
       if(res.ok) {
          setRecentPost(data.posts)
       }
    }
    fetchRecent();
 }, [])

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-3 lg:p-20 p-10 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold'> Welcome To <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className=' px-2 py-1 bg-gradient-to-l from-indigo-500
         via-purple-500 to-pink-500 rounded-lg text-white text-2xl'>
          Fullstack
          </span>
           <span className='font-bold text-3xl text-red-500'>Blog</span>
         </Link>
        </h1>
        <p className='text-gray-500 text-xs sm:text-sm dark:text-white'>Here you get to find your best posts on Development 
          Courses and Graphic Designing enjoy your blogging on our website
        </p>
       <div>
          <Link to='/search' className='text-xs sm:text-sm text-teal-500
          font-bold'>
          View Posts
          </Link>
       </div>
      </div>
       <div className='max-w-6xl mx-auto p-4 bg-amber-400 dark:bg-slate-700'>
        <CallToAction />
       </div>
        <h1 className='text-center mt-5 text-2xl font-bold text-blue-500'>Recent Post</h1>
        <div className='flex flex-wrap lg:max-w-6xl mx-auto p-3 gap-6 mt-3 justify-center'>
        {
          recentPost && recentPost.map((post) => (
             <PostCard key={post._id} post={post} />
          ))
        }
        </div>
        <Link to='/search'>
          <h3 className='text-center italic text-green-500 underline'>
           View all Post
          </h3>
        </Link>
    </div>
  )
}
