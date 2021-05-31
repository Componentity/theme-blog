import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

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
    return <p className='text-center'>Loading...</p>
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
    console.log('UPDATING PAGE NUMBER...')
    setPage(pageNum)
    console.log('PAGE UPDATEPAGE: ', page)
    return null
  }

  // get more posts
  useEffect(async () => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      console.log('CURRENT')
    } else {
      console.log('ON PAGE UPDATE SET LOADING TRUE')
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
    console.log('ON ROUTER USE EFFECT')
    console.log('PAGE', page)
    setBlogs(posts)
  }, [router])

  // disable loadmore
  useEffect(() => {
    console.log('ON EACH PAGE UPDATE IF PAGE === LAST PAGE SET DISABLE TRUE')
    if (page >= totalPages) {
      setDisable(true)
    }
    // console.log('Total', totalPages)
    // console.log('Current Page', page)
  }, [page])

  useEffect(() => {
    console.log('ON EACH BLOGS UPDATE SET LOADING FALSE: ')
    setLoading(false)
  }, [blogs])

  useEffect(() => {
    console.log('LOADING: ', loading)
  }, [loading])

  useEffect(() => {
    console.log('DISABLE: ', disable)
  }, [disable])

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
    return loading ? <p className='text-center'>Loading</p> : ''
  }

  // ===================================
  // LOADMORE BUTTON COMPONENT
  // =====================================

  function Loadmore() {
    return (
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
        disabled={disable}
        onClick={() => updatePage(page * 1 + 1)}
        type='button'
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
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
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50'
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
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50'
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
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50'
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
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50'
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
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50'
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
                <a>
                  <h1 className='text-xl font-bold uppercase text-center mb-2'>{title}</h1>
                </a>
              </Link>
              <hr className='mb-2 w-32 mx-auto' />
            </>
          ) : (
            ''
          )}
          {loading && paginationStyle == 'pagination' ? (
            <p className='text-center'>Loading</p>
          ) : (
            <ol className='blog-list'>
              {blogs &&
                blogs.map((blog_pack) => {
                  return (
                    <li key={blog_pack.blog.id} className='blog'>
                      <div className='mb-10 rounded overflow-hidden flex flex-col mx-auto'>
                        <Link href={`/blog/${blog_pack.blog.slug}`}>
                          <a className='text-xl sm:text-4xl font-semibold inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2'>
                            {blog_pack.blog.title.rendered}
                          </a>
                        </Link>
                        <div className='relative'>
                          <Link href={`/blog/${blog_pack.blog.slug}`}>
                            <a>
                              {blog_pack.blog.featured_media != 0 &&
                              blog_pack.blog.featured_media ? (
                                <Image
                                  height={400}
                                  width={768}
                                  src={blog_pack.blog._embedded['wp:featuredmedia'][0].source_url}
                                  alt=''
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
                            <a className='hidden absolute z-10 text-xs absolute bottom-0 left-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out sm:flex items-center'>
                              <svg
                                fill='currentColor'
                                height='16px'
                                aria-hidden='true'
                                role='img'
                                focusable='false'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  fill='currentColor'
                                  d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                                ></path>
                                <path d='M0 0h24v24H0z' fill='none'></path>
                              </svg>
                              &nbsp;&nbsp;
                              <span>{blog_pack.blog._embedded.author[0].name}</span>
                            </a>
                          </Link>
                          <Link href={`/blog/${blog_pack.blog.slug}`}>
                            <a className='hidden absolute z-10 text-xs absolute bottom-0 right-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out sm:flex items-center'>
                              <span className='text-lg'>|</span>&nbsp;&nbsp;<span>Read more</span>
                            </a>
                          </Link>
                        </div>
                        <div
                          className='text-gray-700 py-5 text-base leading-8'
                          dangerouslySetInnerHTML={{ __html: blog_pack.blog.excerpt.rendered }}
                        />
                        <div className='py-5 text-sm font-regular text-gray-900 flex'>
                          <span className='mr-3 flex flex-row items-center'>
                            <svg
                              className='text-indigo-600'
                              fill='currentColor'
                              height='13px'
                              width='13px'
                              version='1.1'
                              id='Layer_1'
                              xmlns='http://www.w3.org/2000/svg'
                              x='0px'
                              y='0px'
                              viewBox='0 0 512 512'
                            >
                              <g>
                                <g>
                                  <path
                                    d='M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256
			c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128
			c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z'
                                  />
                                </g>
                              </g>
                            </svg>
                            <span className='ml-1'>{blog_pack.blog.date}</span>
                          </span>
                          <a className='flex flex-row items-center hover:text-indigo-600'>
                            <svg
                              className='text-indigo-600'
                              fill='currentColor'
                              height='16px'
                              aria-hidden='true'
                              role='img'
                              focusable='false'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='🔍-Product-Icons' stroke='none' strokeWidth='1' fill='none'>
                                <g id='ic_fluent_news_28_regular' fill='#212121'>
                                  <path
                                    d='M22.75,24 L5.25,24 C3.51696854,24 2.10075407,22.6435452 2.00514479,20.9344239 L2,20.75 L2,6.25 C2,5.05913601 2.92516159,4.08435508 4.09595119,4.00519081 L4.25,4 L19.75,4 C20.940864,4 21.9156449,4.92516159 21.9948092,6.09595119 L22,6.25 L22,7 L23.75,7 C24.940864,7 25.9156449,7.92516159 25.9948092,9.09595119 L26,9.25 L26,20.75 C26,22.4830315 24.6435452,23.8992459 22.9344239,23.9948552 L22.75,24 L5.25,24 L22.75,24 Z M5.25,22.5 L22.75,22.5 C23.6681734,22.5 24.4211923,21.7928897 24.4941988,20.8935272 L24.5,20.75 L24.5,9.25 C24.5,8.87030423 24.2178461,8.55650904 23.8517706,8.50684662 L23.75,8.5 L22,8.5 L22,19.25 C22,19.6296958 21.7178461,19.943491 21.3517706,19.9931534 L21.25,20 C20.8703042,20 20.556509,19.7178461 20.5068466,19.3517706 L20.5,19.25 L20.5,6.25 C20.5,5.87030423 20.2178461,5.55650904 19.8517706,5.50684662 L19.75,5.5 L4.25,5.5 C3.87030423,5.5 3.55650904,5.78215388 3.50684662,6.14822944 L3.5,6.25 L3.5,20.75 C3.5,21.6681734 4.20711027,22.4211923 5.10647279,22.4941988 L5.25,22.5 L22.75,22.5 L5.25,22.5 Z M10.2465274,13.0034726 C10.9368834,13.0034726 11.4965274,13.5631166 11.4965274,14.2534726 L11.4965274,17.75 C11.4965274,18.4403559 10.9368834,19 10.2465274,19 L6.75,19 C6.05964406,19 5.5,18.4403559 5.5,17.75 L5.5,14.2534726 C5.5,13.5631166 6.05964406,13.0034726 6.75,13.0034726 L10.2465274,13.0034726 Z M14.25,17.5 L17.7461806,17.5 C18.1603942,17.5 18.4961806,17.8357864 18.4961806,18.25 C18.4961806,18.6296958 18.2140267,18.943491 17.8479512,18.9931534 L17.7461806,19 L14.25,19 C13.8357864,19 13.5,18.6642136 13.5,18.25 C13.5,17.8703042 13.7821539,17.556509 14.1482294,17.5068466 L14.25,17.5 L17.7461806,17.5 L14.25,17.5 Z M9.99652744,14.5034726 L7,14.5034726 L7,17.5 L9.99652744,17.5 L9.99652744,14.5034726 Z M14.25,13.0034726 L17.7461806,13.0034726 C18.1603942,13.0034726 18.4961806,13.339259 18.4961806,13.7534726 C18.4961806,14.1331683 18.2140267,14.4469635 17.8479512,14.4966259 L17.7461806,14.5034726 L14.25,14.5034726 C13.8357864,14.5034726 13.5,14.1676861 13.5,13.7534726 C13.5,13.3737768 13.7821539,13.0599816 14.1482294,13.0103192 L14.25,13.0034726 L17.7461806,13.0034726 L14.25,13.0034726 Z M6.24639584,8.49665793 L17.7461806,8.49665793 C18.1603942,8.49665793 18.4961806,8.83244437 18.4961806,9.24665793 C18.4961806,9.6263537 18.2140267,9.94014889 17.8479512,9.98981132 L17.7461806,9.99665793 L6.24639584,9.99665793 C5.83218228,9.99665793 5.49639584,9.66087149 5.49639584,9.24665793 C5.49639584,8.86696217 5.77854972,8.55316697 6.14462528,8.50350455 L6.24639584,8.49665793 L17.7461806,8.49665793 L6.24639584,8.49665793 Z'
                                    id='🎨-Color'
                                  ></path>
                                </g>
                              </g>
                            </svg>
                            {blog_pack.cats.map((cat) => {
                              return (
                                <span className='ml-1' key={cat.id}>
                                  <Link href={`/category/${cat.slug}`}>
                                    <a>{cat.name}</a>
                                  </Link>
                                </span>
                              )
                            })}
                          </a>
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
          <hr />
        </div>
      )}
    </>
  )
}
