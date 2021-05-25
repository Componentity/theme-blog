import React from 'react'
import Link from 'next/link'
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            <a>{post.title.rendered}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://reporterly.net/wp-json/wp/v2/posts')
  const posts = await res.json()

  return {
    props: {
      posts
    }
  }
}
