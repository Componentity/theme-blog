import React from 'react'
import Image from 'next/image'

export default function ImageComponentity({ src, alt, classes = 'h-52 w-full' }) {
  return (
    <div className={`relative item-detail bg-gray-100 ${classes}`}>
      <Image layout='fill' objectFit='cover' priority='true' src={src} alt={alt} />
    </div>
  )
}
