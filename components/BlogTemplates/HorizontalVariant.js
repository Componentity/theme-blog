import ImageComponentity from '../ImageComponentity'
import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'

export default function HorizontalVariant({ blog_pack, section, index }) {
  const First = () => {
    return (
      <div key={blog_pack.blog.id} className='sm:col-span-6 lg:col-span-5'>
        <a aria-label='blog link'>
          <div
            className='h-56 bg-cover text-center overflow-hidden bg-gray-100'
            title='Woman holding a mug'
          ></div>
        </a>
        <div className='mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal'>
          <div className='lg:pl-16'>
            <a
              aria-label='blog link'
              className='text-xs text-indigo-600 uppercase font-medium mb-3 flex items-center hover:text-gray-900 transition duration-500 ease-in-out'
            >
              Fashion
            </a>
            <a
              aria-label='blog link'
              className='text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 transition duration-500 ease-in-out'
            >
              The perfect summer sweater that you can wear!{' '}
            </a>
            <p className='text-gray-700 text-xs mt-2'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
              Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
          </div>
        </div>
      </div>
    )
  }
  const Last = () => {
    return (
      <div className='sm:col-span-12 lg:col-span-3'>
        <a aria-label='blog link'>
          <div
            className='h-56 bg-cover text-center overflow-hidden bg-gray-100'
            title='Woman holding a mug'
          ></div>
        </a>
        <div className='mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal'>
          <div className=''>
            <a
              aria-label='blog link'
              className='text-xs text-indigo-600 uppercase font-medium flex items-center hover:text-gray-900 transition duration-500 ease-in-out'
            >
              Fashion
            </a>
            <a
              aria-label='blog link'
              className='text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 transition duration-500 ease-in-out'
            >
              The perfect summer sweater that you can wear!{' '}
            </a>
            <p className='text-gray-700 text-xs mt-2'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>
        </div>
      </div>
    )
  }
  const Default = () => {
    return (
      <div className='flex items-start mb-3 pb-3'>
        <a aria-label='blog link' className='inline-block mr-3'>
          <div className='w-20 h-20 bg-cover bg-center bg-gray-100'></div>
        </a>
        <div className='text-sm'>
          <p className='text-gray-600 text-xs'>Aug 18</p>
          <a
            aria-label='blog link'
            className='text-gray-900 font-medium hover:text-indigo-600 leading-none'
          >
            Cristiano Ronaldo of Juventus FC looks dejected during the...
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {index == 0 && <First />}
      {index == 1 && ReactHtmlParser(`<div class='sm:col-span-6 lg:col-span-4'>`)}
      {index >= 1 && index < 6 && <Default />}
      {index == 5 && ReactHtmlParser(`</div>`)}
      {index == 5 && <Last />}
    </>
  )
}
