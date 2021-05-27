import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

async function getNewPostsFromApi(page = 2, type = 'categories', type_id = 1) {
  const id = type_id
  const res = await fetch(
    `https://reporterly.net/wp-json/wp/v2/posts?${type}=${id}&_embed=true&page=${page}`
  )
  return await res.json()
}

export default function Posts({
  posts,
  type,
  type_id,
  totalPages,
  paginationStyle = 'pagination'
}) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [blogs, setBlogs] = useState(posts)
  //   console.log(posts)

  const isInitialMount = useRef(true)

  // trigger loadmore (update page number)
  function updatePage() {
    console.log('UPDATING NUMBER...')
    setLoading(true)
    return setPage(page + 1)
  }

  // get more posts
  useEffect(async () => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const newPosts = await getNewPostsFromApi(page, type, type_id)
      if (newPosts.length > 0) {
        if (paginationStyle == 'pagination') {
          setBlogs([...newPosts])
        } else {
          setBlogs([...blogs, ...newPosts])
        }
      } else {
        setDisable(true)
      }
      setLoading(false)
    }
  }, [page])

  // disable loadmore
  useEffect(() => {
    if (page >= totalPages) {
      setDisable(true)
    }
    console.log('Total', totalPages)
    console.log('Current Page', page)
  }, [page])

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
            updatePage()
          }
        }
      }
    }
  }

  // =============================================
  // LOAD MORE BUTTON OR PAGINATION
  // =============================================

  function Pagination({ type }) {
    if (type == 'loadmore') {
      return (
        <button disabled={disable} onClick={updatePage} type='button'>
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )
    } else if (type == 'pagination') {
      return <PaginationButtons />
    }
    return ''
  }

  // ================================
  // PAGINATION BUTTONS
  // ================================
  function PaginationButtons() {
    const pagesArray = []
    // first
    pagesArray.push(
      <li key='first'>
        <button disabled={page == 1 ? true : false} onClick={() => setPage(1)}>
          First
        </button>
      </li>
    )
    // previous
    pagesArray.push(
      <li key='prev'>
        <button disabled={page == 1 ? true : false} onClick={() => setPage(page - 1)}>
          Prev
        </button>
      </li>
    )
    // current + 5
    let noBefore
    let noAfter
    let start = page
    let last = totalPages

    if (page < totalPages - 5) {
      noAfter = 5
      noBefore = 0
      start = page * 1
      last = start + 5
    } else {
      noAfter = totalPages - page // 180 - 178 = 2
      noBefore = 5 - noAfter // 5 - 2 = 3
      start = page - noBefore // 178 - 3 = 175
    }

    for (let i = start; i <= last; i++) {
      pagesArray.push(
        <li key={i}>
          <button disabled={page == i ? true : false} onClick={() => setPage(i)}>
            {i}
          </button>
        </li>
      )
    }

    // next
    pagesArray.push(
      <li key='next'>
        <button disabled={page == totalPages ? true : false} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </li>
    )
    // last
    pagesArray.push(
      <li key='last'>
        <button disabled={page == totalPages ? true : false} onClick={() => setPage(totalPages)}>
          Last
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
          <h1>All Posts</h1>
          <ol className='blog-list'>
            {blogs.map((blog) => {
              return (
                <li key={blog.id} className='blog'>
                  <Link href={`/blog/${blog.slug}`}>
                    <a>{blog.title.rendered}</a>
                  </Link>
                </li>
              )
            })}
          </ol>
          <hr />
          <Pagination type={paginationStyle} />
          <hr />
        </div>
      )}
    </>
  )
}
