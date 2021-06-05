import ImageComponentity from '../ImageComponentity'
import SVGCategory from '../SVG/SVGCategory'
import SVGAuthor from '../SVG/SVGAuthor'
import SVGClock from '../SVG/SVGClock'
import Link from 'next/link'

export default function SingleCol({ blog_pack }) {
  return (
    <div className='mb-10 rounded overflow-hidden flex flex-col mx-auto'>
      <Link href={`/blog/${blog_pack.blog.slug}`}>
        <a
          aria-label='Blog post'
          className='dark:text-gray-50 dark:hover:text-indigo-600 hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2'
        >
          <h1 className='text-xl sm:text-4xl font-semibold'>{blog_pack.blog.title.rendered}</h1>
        </a>
      </Link>
      <div className='relative'>
        <Link href={`/blog/${blog_pack.blog.slug}`}>
          <a aria-label='Blog post'>
            {blog_pack.blog.featured_media != 0 && blog_pack.blog.featured_media ? (
              <ImageComponentity
                src={blog_pack.blog._embedded['wp:featuredmedia'][0].source_url}
                alt={blog_pack.blog.title.rendered}
              />
            ) : (
              <div className='h-400 w-full bg-gray-100'></div>
            )}
          </a>
        </Link>
        <Link href={`/author/${encodeURIComponent(blog_pack.blog._embedded.author[0].slug)}`}>
          <a
            aria-label='Author'
            className='group absolute z-10 text-xs bottom-0 left-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out sm:flex flex-row gap-1 items-center'
          >
            <SVGAuthor />
            <span>{blog_pack.blog._embedded.author[0].name}</span>
          </a>
        </Link>
        <Link href={`/blog/${blog_pack.blog.slug}`}>
          <a
            aria-label='Blog post'
            className='hidden absolute z-10 text-xs absolute bottom-0 right-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out sm:flex items-center'
          >
            <span className='text-lg'>|</span>&nbsp;&nbsp;<span>Read more</span>
          </a>
        </Link>
      </div>
      <div
        className='text-gray-700 py-5 text-base leading-8 dark:text-gray-300'
        dangerouslySetInnerHTML={{ __html: blog_pack.blog.excerpt.rendered }}
      />
      <div className='py-5 text-sm font-regular text-gray-900 dark:text-gray-300 flex'>
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
      <hr />
    </div>
  )
}
