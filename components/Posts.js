import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Posts({ posts }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  //   console.log(posts)
  return (
    <>
      {posts === null ? (
        <h1>Not found</h1>
      ) : (
        <div>
          <h1>All Posts</h1>
          <ul>
            {posts.map((post) => {
              return (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <a>{post.title.rendered}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
          <hr />
        </div>
      )}
    </>
  )
}
