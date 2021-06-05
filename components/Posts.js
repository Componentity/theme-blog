import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import SectionTitle from './SectionTitle'
import ResponsiveArticle from './skeleton/ResponsiveArticle'
import SVGReload from './SVG/SVGReload'
import GridCols from './BlogTemplates/GridCols'
import HorizontalSmall from './BlogTemplates/HorizontalSmall'
import HorizontalVariant from './BlogTemplates/HorizontalVariant'

async function getNewPostsFromApi(page, type, type_id, count) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/posts?_embed=true&${type}=${type_id}&page=${page}&per_page=${count}`
  )
  const blogs = await res.json()

  const posts = []
  for (const post of blogs) {
    const post_id = post.id
    // get categories
    const post_cats = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/categories?post=${post_id}`)
    const cats = await post_cats.json()
    // get tags
    const post_tags = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/tags?post=${post_id}`)
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
  paginationStyle,
  perPage,
  section
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
      const newPosts = await getNewPostsFromApi(page, type, type_id, perPage)
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
          className='flex flex-row items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 w-40 h-12 rounded disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled={disable}
          onClick={() => updatePage(page * 1 + 1)}
        >
          <SVGReload />
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

  const BlogTemplate = (blog_pack, section, index) => {
    switch (section.liType) {
      case 'HorizontalSmall':
        return <HorizontalSmall blog_pack={blog_pack} section={section} index={index} />
      case 'HorizontalVariant':
        return <HorizontalVariant blog_pack={blog_pack} section={section} index={index} />

      default:
        return <GridCols blog_pack={blog_pack} section={section} index={index} />
    }
  }

  return (
    <>
      {blogs.length == 0 ? (
        <h1>No Results found</h1>
      ) : (
        <div>
          {title ? <SectionTitle link={slug ? `/${type_url}/${slug}` : ''} title={title} /> : ''}
          {loading && paginationStyle == 'pagination' ? (
            <ResponsiveArticle />
          ) : (
            <ol className={`${section.olClasses}`}>
              {blogs &&
                blogs.map((blog_pack, index) => {
                  return BlogTemplate(blog_pack, section, index)
                })}
            </ol>
          )}
          <div className='flex items-center justify-center'>
            {paginationStyle ? <Pagination type={paginationStyle} /> : ''}
          </div>
        </div>
      )}
    </>
  )
}
