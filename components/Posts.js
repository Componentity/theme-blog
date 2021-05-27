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

export default function Posts({ posts, type, type_id, totalPages }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const [page, setPage] = useState(1)
  const [disable, setDisable] = useState(false)
  const [blogs, setBlogs] = useState(posts)
  //   console.log(posts)

  const isInitialMount = useRef(true)

  useEffect(async () => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const newPosts = await getNewPostsFromApi(page, type, type_id)
      if (newPosts.length > 0) {
        setBlogs([...blogs, ...newPosts])
      } else {
        setDisable(true)
      }
    }
  }, [page])

  useEffect(() => {
    if (page >= totalPages) {
      setDisable(true)
    }
    console.log('Total', totalPages)
    console.log('Current Page', page)
  }, [page])

  return (
    <>
      {blogs.length == 0 ? (
        <h1>No Results found</h1>
      ) : (
        <div>
          <h1>All Posts</h1>
          <ol>
            {blogs.map((blog) => {
              return (
                <li key={blog.id}>
                  <Link href={`/blog/${blog.slug}`}>
                    <a>{blog.title.rendered}</a>
                  </Link>
                </li>
              )
            })}
          </ol>
          <hr />
          <button disabled={disable} onClick={() => setPage(page + 1)} type='button'>
            Load more
          </button>
          <hr />
        </div>
      )}
    </>
  )
}
