import React from 'react'
import Image from 'next/image'

export default function ImageComponentity({ src, alt, height = 400, width = 708 }) {
  return (
    <div className='relative item-detail bg-gray-100'>
      <Image layout='fill' objectFit='cover' priority='true' src={src} alt={alt} />
    </div>
  )
}
