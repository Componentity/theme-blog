import ImageComponentity from '../ImageComponentity'
import SVGCategory from '../SVG/SVGCategory'
import SVGClock from '../SVG/SVGClock'
import Link from 'next/link'

export default function GridCols({ blog_pack, section }) {
  return (
    <div
      key={blog_pack.blog.id}
      className='mb-10 rounded overflow-hidden flex flex-col justify-between mx-auto'
    >
      <Link href={`/blog/${blog_pack.blog.slug}`}>
        <a
          aria-label='Blog post'
          className='dark:text-gray-50 dark:hover:text-indigo-600 hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2'
        >
          <h1 className='text-xl font-semibold line-clamp-3 h-20 mb-2'>
            {blog_pack.blog.title.rendered}
          </h1>
        </a>
      </Link>
      <div>
        <Link href={`/blog/${blog_pack.blog.slug}`}>
          <a aria-label='Blog post'>
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
        <div className='py-5 text-sm font-regular text-gray-900 dark:text-gray-300 flex justify-between items-center'>
          <span className='mr-3 flex flex-row gap-1 items-center'>
            <SVGClock />
            <span className='ml-1'>{blog_pack.blog.date}</span>
          </span>
          <span className='flex flex-row gap-1 items-center hover:text-indigo-600 dark:hover:text-indigo-600'>
            <SVGCategory />
            {blog_pack.cats.map((cat) => {
              return (
                <div className='ml-1' key={cat.id}>
                  <Link href={`/category/${cat.slug}`}>
                    <a aria-label='Category'>{cat.name}</a>
                  </Link>
                </div>
              )
            })}
          </span>
        </div>
      </div>
      <hr />
    </div>
  )
}
