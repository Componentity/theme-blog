import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

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
    return <div>Loading...</div>
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
    return loading ? <p>Loading...</p> : ''
  }

  // ===================================
  // LOADMORE BUTTON COMPONENT
  // =====================================

  function Loadmore() {
    return (
      <button disabled={disable} onClick={() => updatePage(page * 1 + 1)} type='button'>
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
        <button disabled={page == 1 ? true : false} onClick={() => updatePage(1)}>
          First
        </button>
      </li>
    )
    // previous
    pagesArray.push(
      <li key='prev'>
        <button disabled={page == 1 ? true : false} onClick={() => updatePage(page - 1)}>
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
          <button disabled={page == i ? true : false} onClick={() => updatePage(i)}>
            {i}
          </button>
        </li>
      )
    }

    // next
    pagesArray.push(
      <li key='next'>
        <button disabled={page == totalPages ? true : false} onClick={() => updatePage(page + 1)}>
          Next
        </button>
      </li>
    )
    // last
    pagesArray.push(
      <li key='last'>
        <button disabled={page == totalPages ? true : false} onClick={() => updatePage(totalPages)}>
          Last ({totalPages})
        </button>
      </li>
    )

    return (
      <ul>
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
            <Link href={`/${type_url}/${slug}`}>
              <a>
                <h1>{title}</h1>
              </a>
            </Link>
          ) : (
            ''
          )}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ol start={paginationStyle == 'pagination' ? page * 10 - 9 : 1} className='blog-list'>
              {blogs &&
                blogs.map((blog_pack) => {
                  return (
                    <li key={blog_pack.blog.id} className='blog'>
                      <Link href={`/blog/${blog_pack.blog.slug}`}>
                        <a>
                          <h6>{blog_pack.blog.title.rendered}</h6>
                        </a>
                      </Link>
                      <p>{blog_pack.blog.excerpt.rendered}</p>
                      <hr />
                      <ul>
                        <li>
                          <Link
                            href={`/author/${encodeURIComponent(
                              blog_pack.blog._embedded.author[0].slug
                            )}`}
                          >
                            <a>Author: {blog_pack.blog._embedded.author[0].name}</a>
                          </Link>
                        </li>
                      </ul>
                      <hr />
                      <p>Categories: </p>
                      <ul>
                        {blog_pack.cats.map((cat) => {
                          return (
                            <li key={cat.id}>
                              <Link href={`/category/${cat.slug}`}>
                                <a>{cat.name}</a>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                      <hr />
                    </li>
                  )
                })}
            </ol>
          )}
          <hr />
          {paginationStyle ? <Pagination type={paginationStyle} /> : ''}
          <hr />
        </div>
      )}
    </>
  )
}
