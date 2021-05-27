import React from 'react'
import Posts from './../components/Posts'

// show 5 posts of this category
// show 3 posts of this author
// show 4 posts latest
export default function Blog({ posts }) {
  return <Posts posts={posts} />
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
