import ImageComponentity from '../ImageComponentity'
import Link from 'next/link'

export default function HorizontalSmall({ blog_pack, section }) {
  return (
    <div key={blog_pack.blog.id} className='flex flex-col justify-between border-b pb-5'>
      <Link href={`/blog/${blog_pack.blog.slug}`}>
        <a aria-label='heading'>
          <h1
            aria-label='heading'
            className='line-clamp-3 h-12 text-gray-900 font-medium hover:text-indigo-600'
          >
            {blog_pack.blog.title.rendered}
          </h1>
        </a>
      </Link>
      <div className='flex items-between justify-between mt-3'>
        <div className='text-sm w-2/3 flex flex-col justify-between'>
          <p
            className='text-gray-700 line-clamp-2 h-10'
            dangerouslySetInnerHTML={{ __html: blog_pack.blog.excerpt.rendered }}
          />
          <span className='text-gray-600 text-xs'>- {blog_pack.blog.date}</span>
        </div>
        <Link href={`/blog/${blog_pack.blog.slug}`}>
          <a aria-label='image' className='inline-block ml-2'>
            {blog_pack.blog.featured_media != 0 && blog_pack.blog.featured_media ? (
              <ImageComponentity
                src={blog_pack.blog._embedded['wp:featuredmedia'][0].source_url}
                classes={section.imageClasses}
                alt={blog_pack.blog.title.rendered}
              />
            ) : (
              <div className={`${section.heightClass} w-full bg-gray-100`}></div>
            )}
          </a>
        </Link>
      </div>
    </div>
  )
}
