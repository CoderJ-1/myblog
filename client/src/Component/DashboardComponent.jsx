import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiAnnotation, HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi'
import { BiBookAlt } from 'react-icons/bi'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardComponent() {

    const { Currentuser } = useSelector((state) => state.user)

    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState([])
    const [lastMonthPosts, setLastMonthPosts] = useState([])
    const [lastMonthComments, setLastMonthComments] = useState([])

    useEffect(() => {
         const fetchUsers = async () => {
            const res = await fetch(`/api/user/getusers?limit=3`)
            const data = await res.json()
            if(res.ok){
                setUsers(data.users)
                setTotalUsers(data.totalUsers)
                setLastMonthUsers(data.lastMonthUsers)
            }
         }
         const fetchPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=5`)
                const data = await res.json()
                if(res.ok){
                    setPosts(data.posts)
                    setTotalPosts(data.totalPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }
         }
         const fetchComments = async () => {
            const res = await fetch(`/api/comment/getcomments?limit=3`)
                const data = await res.json()
                if(res.ok){
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
         }
         if(Currentuser.isAdmin) {
            fetchUsers(),
            fetchPosts(),
            fetchComments()
         }
    }, [])

  return (
    <div className='p-3 mx-auto'>
     <div className='flex-wrap flex gap-5'>
     <div className='bg-slate-200 flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
       rounded-md shadow-sm'>
         <div className='flex justify-between'>
            <div>
                <h3 className='text-gray-500 text-md uppercase font-semibold'>Total Users</h3>
                <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white
                rounded-full text-5xl p-3 shadow-lg' />
         </div>
            <div className='flex gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                    { lastMonthUsers.length != 0 && ( <HiArrowNarrowUp /> ) }
                    {lastMonthUsers}
                </span>
                <p className='text-gray-500'>Last Month</p>
            </div>
       </div>
       <div className='bg-slate-200 flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
       rounded-md shadow-sm'>
         <div className='flex justify-between'>
            <div>
                <h3 className='text-gray-500 text-md uppercase font-semibold'>Total Posts</h3>
                <p className='text-2xl'>{totalPosts}</p>
            </div>
            <BiBookAlt  className='bg-teal-600 text-white
                rounded-full text-5xl p-3 shadow-lg' />
         </div>
            <div className='flex gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                { lastMonthPosts.length != 0 && ( <HiArrowNarrowUp /> ) }
                    {lastMonthPosts}
                </span>
                <p className='text-gray-500'>Last Month</p>
            </div>
       </div>
       <div className='bg-slate-200 flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
       rounded-md shadow-sm'>
         <div className='flex justify-between'>
            <div>
                <h3 className='text-gray-500 text-md uppercase font-semibold'>Total Comment</h3>
                <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-teal-600 text-white
                rounded-full text-5xl p-3 shadow-lg' />
         </div>
            <div className='flex gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                { lastMonthComments.length != 0 && ( <HiArrowNarrowUp /> ) }
                    {lastMonthComments}
                </span>
                <p className='text-gray-500'>Last Month</p>
            </div>
       </div>
     </div>
      <div className='flex flex-wrap gap-4 justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-sm dark:bg-gray-800 mt-3'>
            <div className='flex justify-between p-3 text-sm
             font-semibold'>
              <h1>Recent Users</h1>
              <Link to={'/dashboard?tab=users'}>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
              </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                     <Table.HeadCell>
                         User Profile
                     </Table.HeadCell>
                     <Table.HeadCell>
                         Username
                     </Table.HeadCell>
                </Table.Head>
                {
                    users && users.map((user) => (
                        <Table.Body key={user._id} className='divide-y'>
                        <Table.Row className=''>
                            <Table.Cell>
                                <img src={user.profilePicture} alt='user' 
                                className='w-10 h-10 rounded-full bg-gray-500'  />
                            </Table.Cell>
                            <Table.Cell>
                                {user.username}
                            </Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    ))
                }
            </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-sm dark:bg-gray-800 mt-3'>
            <div className='flex justify-between p-3 text-sm
             font-semibold'>
              <h1>Recent Posts</h1>
              <Link to={'/dashboard?tab=posts'}>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
              </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                     <Table.HeadCell>
                         Post Image
                     </Table.HeadCell>
                     <Table.HeadCell>
                         Post Title
                     </Table.HeadCell>
                </Table.Head>
                {
                    posts && posts.map((post) => (
                        <Table.Body key={post._id} className='divide-y'>
                        <Table.Row className=''>
                          
                            <Table.Cell>
                              <Link to={`/post/${post.slug}`}>
                                <img src={post.image} alt='user' 
                                className='w-20 h-10 bg-gray-500'  />
                              </Link>
                            </Table.Cell>
                            <Table.Cell className='w-55'>
                                <Link to={`/post/${post.slug}`}>
                                 {post.title}
                                </Link>
                            </Table.Cell>
                          
                        </Table.Row>
                        </Table.Body>
                        
                    ))
                }
            </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-sm dark:bg-gray-800 mt-3'>
            <div className='flex justify-between p-2 gap-3 text-sm
             font-semibold'>
              <h1>Recent Comments</h1>
              <Link to={'/dashboard?tab=comments'}>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
              </Link>
            </div>
            <Table hoverable>
                <Table.Head>
                     <Table.HeadCell>
                         User Content
                     </Table.HeadCell>
                     <Table.HeadCell>
                         Likes
                     </Table.HeadCell>
                </Table.Head>
                {
                    comments && comments.map((comment) => (
                        <Table.Body key={comment._id} className='divide-y'>
                        <Table.Row className=''>
                            <Table.Cell className='w-50'>
                                {comment.content}
                            </Table.Cell>
                            <Table.Cell>
                                {comment.numberOfLikes}
                            </Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    ))
                }
            </Table>
        </div>
      </div> 
    </div>
  )
}
