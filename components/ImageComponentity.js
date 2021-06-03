import React from 'react'
import Image from 'next/image'

export default function ImageComponentity({ src, alt, height = 400, width = 708 }) {
  return (
    <div className='relative item-detail'>
      <Image objectFit={'cover'} priority='true' layout='responsive' src={src} alt={alt} />
    </div>
  )
}
