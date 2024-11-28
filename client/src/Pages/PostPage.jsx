import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../Component/CallToAction';
import Comment from '../Component/Comment';
import PostCard from '../Component/PostCard';

export default function PostPage() {

    const { slug } = useParams()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentpost, setRecentPost] = useState(null)

      useEffect(() => {
        const Post = async () => {
          try {
             setLoading(true);
             const res = await fetch(`/api/post/getposts?slug=${slug}`)
             const data = await res.json();
             if(!res.ok){
                setError(true)
                setLoading(false)
                return;
             }
             if(res.ok){
                setPost(data.posts[0])
                setLoading(false)
                setError(false)
             }
          } catch (error) {
            setError(true)
            setLoading(false)
          }   
        }; 
          Post();
      }, [slug])

      useEffect(() => { 
         const fetchRecent = async () => {
          const res = await fetch(`/api/post/getposts?limit=3`)
          const data = await res.json()
            if(res.ok) {
               setRecentPost(data.posts)
            }
         }
         fetchRecent();
      }, [])

      if(loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>
)
    return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl mt-10 p-3 font-serif max-w-2xl mx-auto
        lg:text-4xl '>{post && post.title}</h1>

        <Link className='self-center m-3' to={`/serach?category=${post && post.category}`}>
            <Button color='gray' pill size='xs'>
                {post && post.category}
            </Button>
        </Link>

        <img src={post && post.image} className='mt-1 p-3 
        max -h- [600px] w-full object-cover' 
        alt={post && post.title} />

            <div className='flex justify-between p-3 border-b 
            border-slate-500 w-full mx-auto text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span> 
                <span className='italic'>{post && (post.content.length /1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-3 mx-auto w-full post-content ' dangerouslySetInnerHTML={{__html:  post && post.content}}>
            </div>

            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction />
            </div>
            <div>
               <Comment postId={post._id} />
            </div>

            <div className='flex flex-col justify-center'>
               <h1 className='text-center font-semibold mt-5'>Recent Articles</h1>
               <div className='flex flex-wrap gap-3 mt-5 justify-center'>
                  {
                    recentpost &&
                    recentpost.map((post) => (
                      <PostCard key={post._id} post={post} />
                    )) 
                  }
               </div>
            </div>
    </main>
  )
}
