import React from 'react'
import CallToAction from '../Component/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen'>
       <div className='max-w-3xl justify-center items-center mx-auto text-center p-4 mt-20'>
         <h1 className='text-2xl font-bold'>Project</h1>
         <p className='font-semibold mt-2'>Come and build your content on our Platform for more visibility</p>
         <CallToAction />
       </div>
    </div>
  )
}
