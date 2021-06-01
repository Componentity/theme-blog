import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import ResponsiveArticle from './skeleton/ResponsiveArticle'
import SVGCategory from './SVG/SVGCategory'
import SVGAuthor from './SVG/SVGAuthor'
import SVGClock from './SVG/SVGClock'

async function getNewPostsFromApi(page, type, type_id) {
  const res = await fetch(
    `https://reporterly.net/wp-json/wp/v2/posts?_embed=true&${type}=${type_id}&page=${page}`
  )
  const blogs = await res.json()

  const posts = []
  for (const post of blogs) {
    const post_id = post.id
    // get categories
    const post_cats = await fetch(`https://reporterly.net/wp-json/wp/v2/categories?post=${post_id}`)
    const cats = await post_cats.json()
    // get tags
    const post_tags = await fetch(`https://reporterly.net/wp-json/wp/v2/tags?post=${post_id}`)
    const tags = await post_tags.json()

    posts.push({ blog: post, cats, tags })
  }

  return posts
}

export default function Posts({
  posts,
  title,
  slug,
  type,
  type_id,
  totalPages = 1,
  paginationStyle
}) {
  const router = useRouter()
  if (router.isFallback) {
    return <ResponsiveArticle />
  }

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  // posts
  // [{blog:post, cats, tags}, {blog:post, cats, tags}, {blog:post, cats, tags}, ]
  const [blogs, setBlogs] = useState(posts)
  // console.log('BLOGS: POSTS.JS', blogs)

  const isInitialMount = useRef(true)

  let type_url
  switch (type) {
    case 'categories':
      type_url = 'category'
      break
    case 'tags':
      type_url = 'tag'
      break

    default:
      type_url = type
      break
  }

  // trigger loadmore (update page number)
  function updatePage(pageNum) {
    // console.log('UPDATING PAGE NUMBER...')
    setPage(pageNum)
    // console.log('PAGE UPDATEPAGE: ', page)
    return null
  }

  // get more posts
  useEffect(async () => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // console.log('CURRENT')
    } else {
      // console.log('ON PAGE UPDATE SET LOADING TRUE')
      setLoading(true)
      const newPosts = await getNewPostsFromApi(page, type, type_id)
      if (newPosts.length > 0) {
        if (paginationStyle == 'pagination') {
          setBlogs([...newPosts])
        } else {
          setBlogs([...blogs, ...newPosts])
        }
      }
    }
  }, [page])

  useEffect(() => {
    // console.log('ON ROUTER USE EFFECT')
    // console.log('PAGE', page)
    setBlogs(posts)
  }, [router])

  // disable loadmore
  useEffect(() => {
    // console.log('ON EACH PAGE UPDATE IF PAGE === LAST PAGE SET DISABLE TRUE')
    if (page >= totalPages) {
      setDisable(true)
    }
    // console.log('Total', totalPages)
    // console.log('Current Page', page)
  }, [page])

  useEffect(() => {
    // console.log('ON EACH BLOGS UPDATE SET LOADING FALSE: ')
    setLoading(false)
  }, [blogs])

  // ========================================================
  // INFINITE SCROLLING
  // ========================================================

  // Listen to scroll positions for loading more data on scroll
  if (paginationStyle == 'infinite') {
    useEffect(() => {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    })

    const handleScroll = () => {
      if (!loading && !disable) {
        // To get page offset of last blog
        const lastBlogLoaded = document.querySelector('.blog-list > .blog:last-child')
        if (lastBlogLoaded) {
          const lastBlogLoadedOffset = lastBlogLoaded.offsetTop + lastBlogLoaded.clientHeight
          const pageOffset = window.pageYOffset + window.innerHeight
          // Detects when user scrolls down till the last blog
          if (pageOffset > lastBlogLoadedOffset) {
            // fetch new posts
            updatePage(page * 1 + 1)
          }
        }
      }
    }
  }

  // =============================================
  // LOAD MORE BUTTON OR PAGINATION COMPONENT
  // =============================================

  function Pagination({ type }) {
    if (type == 'loadmore') {
      return <Loadmore />
    } else if (type == 'pagination') {
      return <PaginationButtons />
    } else if (type == 'infinite') {
      return <InfiniteLoader />
    }
    return ''
  }

  // ===================================
  // INFINITE LOADING COMPONENT
  // ===================================
  function InfiniteLoader() {
    return loading ? <ResponsiveArticle /> : ''
  }

  // ===================================
  // LOADMORE BUTTON COMPONENT
  // =====================================

  function Loadmore() {
    return (
      <>
        {loading ? <ResponsiveArticle /> : ''}
        <button
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={disable}
          onClick={() => updatePage(page * 1 + 1)}
          type='button'
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      </>
    )
  }

  // ================================
  // PAGINATION BUTTONS
  // ================================
  function PaginationButtons() {
    const pagesArray = []
    // first
    pagesArray.push(
      <li key='first'>
        <button
          className='border hidden sm:inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={page == 1 ? true : false}
          onClick={() => updatePage(1)}
        >
          First
        </button>
      </li>
    )
    // previous
    pagesArray.push(
      <li key='prev'>
        <button
          className='border bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={page == 1 ? true : false}
          onClick={() => updatePage(page - 1)}
        >
          Prev
        </button>
      </li>
    )
    // current + 5
    let noBefore
    let noAfter
    let start = page
    let last = totalPages

    // total pages = 1
    // page = 1
    if (page < totalPages - 5) {
      noAfter = 5
      noBefore = 0
      start = page * 1
      last = start + 5
    } else {
      noAfter = totalPages - page // 180 - 178 = 2 || 1-1=0
      if (totalPages < 5) {
        noBefore = 0
      } else {
        noBefore = 5 - noAfter
      }
      start = page - noBefore
    }

    for (let i = start; i <= last; i++) {
      pagesArray.push(
        <li key={i}>
          <button
            className={`${
              page == i ? '' : 'hidden'
            } border sm:inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            disabled={page == i ? true : false}
            onClick={() => updatePage(i)}
          >
            {i}
          </button>
        </li>
      )
    }

    // next
    pagesArray.push(
      <li key='next'>
        <button
          className='border bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={page == totalPages ? true : false}
          onClick={() => updatePage(page + 1)}
        >
          Next
        </button>
      </li>
    )
    // last
    pagesArray.push(
      <li key='last'>
        <button
          className='border hidden sm:inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={page == totalPages ? true : false}
          onClick={() => updatePage(totalPages)}
        >
          Last ({totalPages})
        </button>
      </li>
    )

    return (
      <ul className='inline-flex text-center'>
        {pagesArray.map((page) => {
          return page
        })}
      </ul>
    )
  }

  return (
    <>
      {blogs.length == 0 ? (
        <h1>No Results found</h1>
      ) : (
        <div>
          {title && slug ? (
            <>
              <Link href={`/${type_url}/${slug}`}>
                <a aria-label='title'>
                  <h1 className='text-xl font-bold uppercase mb-2'>{title}</h1>
                </a>
              </Link>
              <hr className='mb-2 h-2 w-40' />
            </>
          ) : (
            ''
          )}
          {loading && paginationStyle == 'pagination' ? (
            <ResponsiveArticle />
          ) : (
            <ol className='blog-list'>
              {blogs &&
                blogs.map((blog_pack) => {
                  return (
                    <li key={blog_pack.blog.id}>
                      <div className='mb-10 rounded overflow-hidden flex flex-col mx-auto'>
                        <Link href={`/blog/${blog_pack.blog.slug}`}>
                          <a
                            aria-label='Blog post'
                            className='dark:text-gray-50 dark:hover:text-indigo-600 hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2'
                          >
                            <h1 className='text-xl sm:text-4xl font-semibold'>
                              {blog_pack.blog.title.rendered}
                            </h1>
                          </a>
                        </Link>
                        <div className='relative'>
                          <Link href={`/blog/${blog_pack.blog.slug}`}>
                            <a aria-label='Blog post'>
                              {blog_pack.blog.featured_media != 0 &&
                              blog_pack.blog.featured_media ? (
                                <Image
                                  height={400}
                                  width={768}
                                  layout='responsive'
                                  src={blog_pack.blog._embedded['wp:featuredmedia'][0].source_url}
                                  alt={blog_pack.blog.title.rendered}
                                />
                              ) : (
                                <div className='h-400 w-full bg-gray-100'></div>
                              )}
                            </a>
                          </Link>
                          <Link
                            href={`/author/${encodeURIComponent(
                              blog_pack.blog._embedded.author[0].slug
                            )}`}
                          >
                            <a
                              aria-label='Author'
                              className='group hidden absolute z-10 text-xs absolute bottom-0 left-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out sm:flex flex-row gap-1 items-center'
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
                    </li>
                  )
                })}
            </ol>
          )}
          <div className='text-center'>
            {paginationStyle ? <Pagination type={paginationStyle} /> : ''}
          </div>
        </div>
      )}
    </>
  )
}
