import { Button, Label, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../Component/PostCard';

export default function Search() {

    const[ sidebarData, setSidebarData ] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [showMore, SetShowMore] = useState(false)

    const location = useLocation();
    const navigate = useNavigate()

    useEffect (() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm')
      const sortFromUrl = urlParams.get('sort')
      const categoryFromUrl = urlParams.get('category')
      if(searchTermFromUrl || sortFromUrl || categoryFromUrl) {
         setSidebarData({
           ...sidebarData,
           searchTerm: searchTermFromUrl,
           sort: sortFromUrl,
           category: categoryFromUrl

         })

         const fetchpost = async () => {
          setLoading(true)
          const searchQuery = urlParams.toString()
          const res = await fetch(`/api/post/getposts?${searchQuery}`)
    
          if(!res.ok){
            setLoading(false)
            return;
          }
    
          if(res.ok){
            const data = await res.json()
            setPosts(data.posts);
            setLoading(false)
          
           if(data.posts.length === 9 ){
             SetShowMore(true)
           } else {
            SetShowMore(false)
           }
        }
      }
        fetchpost()
      }
    }, [location.search])
    console.log(sidebarData)
    console.log(posts)

    const handleChange = (e) => {
        if(e.target.id  === 'searchTerm') {
          setSidebarData({
             ...sidebarData, searchTerm: e.target.value
          })
        }
        if(e.target.id === 'sort' ) {
           const order = e.target.value || 'desc'
           setSidebarData({ ...sidebarData, sort: order })
        }
        if(e.target.id === 'category') {
            const category = e.target.value || 'uncategorized'
            setSidebarData({ ...sidebarData, category })
        }
    }

    const handleSubmit = (e) => {
       e.preventDefault();

       const urlParams = new URLSearchParams(location.search)
       urlParams.set('searchTerm', sidebarData.searchTerm)
       urlParams.set('sort', sidebarData.sort)
       urlParams.set('category', sidebarData.category)
       const searchQuery =urlParams.toString()
       navigate(`/search?${searchQuery}`);
    }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b border-r md:min-h-screen
      border-gray-500'>
         <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            <div className='flex items-center gap-2'>
                <Label className='whitespace-nowrap font-semibold'>Search Term:</Label>
                <TextInput placeholder='Search....'
                 id='searchTerm'
                 type='text'
                 value={sidebarData.searchTerm}
                 onChange={handleChange}
                />
            </div>
            <div className='flex items-center gap-2'>
                <Label className='whitespace-nowrap font-semibold'>Sort:</Label>
                <Select onChange={handleChange}
                value={sidebarData.sort}
                id='sort'>
                   <option value='desc'>Latest</option>
                   <option value='asc'>Oldest</option>
                </Select>
            </div>
            <div className='flex items-center gap-2'>
                <Label className='whitespace-nowrap font-semibold'>Category:</Label>
               <Select
               onChange={handleChange}
               value={sidebarData.category}
               id='category'>
                 <option value='uncategorized'>uncategorized</option>
                 <option value='Reactjs'>Reactjs</option>
                 <option value='Nextjs'>Nextjs</option>
                 <option value='javascript'>Js</option>
               </Select>
            </div>
            <Button type='submit' gradientDuoTone='purpleToPink' outline>
              Search
            </Button>
         </form>
      </div>
      <div className='w-full'>
        <h1 className='p-4 text-1xl font-semibold uppercase sm:border-b-2 border-blue-300'>Post Result:</h1>
        <div className='flex flex-wrap p-5 gap-4'>
          {
            !loading && posts.length === 0 && <p 
            className='p-5 text-black'>
              No Post Found
            </p>
          }
          {
            loading &&
              <div className='flex justify-center items-center mx-auto pt-32'>
                <Spinner size='xl' />
              </div>
          }
          {
            !loading && posts && posts.map((post) =>
            <div className='p-5'>
                <PostCard key={post._id}
                  post={post}
                />
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
