import React from 'react'
import Image from 'next/image'

export default function ImageComponentity({ src, alt, height = 400, width = 708 }) {
  return (
    <Image height={height} width={width} priority='true' layout='responsive' src={src} alt={alt} />
  )
}
