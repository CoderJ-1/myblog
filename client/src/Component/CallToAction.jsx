import React from 'react'
import img1 from '../img/next.png'
import { Button } from 'flowbite-react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border text-center justify-center items-center
    border-teal-500 rounded-tl-xl rounded-bl-none rounded-br-xl rounded-tr-none'>
        <div className='flex-1 justify center flex flex-col'>
            <h1 className='text-2xl'>
                Want to Learn More About NextJs?
            </h1>
            <p className='text-gray-500 mb-1 dark:text-white'>
                Checkout our courses on our website for our new sessions
            </p>
            <Button gradientDuoTone='pinkToOrange' className=' rounded-tl-xl rounded-bl-none rounded-br-xl rounded-tr-none'>
                <a href='https://nextjs.org/' target='_blank' rel='noopener noreferrer'>
                  Learn More
                </a>
            </Button>
        </div>
        <div className='p-4 flex-1'>
             <img src={img1} />
        </div>
    </div>
  )
}
