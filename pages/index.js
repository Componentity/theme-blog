import React from 'react'
import Posts from './../components/Posts'

// show 5 posts of this category
// show 3 posts of this author
// show 4 posts latest
export default function Blog(postsContainer) {
  return Object.entries(postsContainer).map((posts) => {
    return <Posts key={posts[0]} posts={posts[1]} />
  })
}

export async function getStaticProps() {
  const sections = [
    {
      name: 'CATEGORY ONE',
      type: 'categories',
      type_id: 1331,
      count: 5
    },
    {
      name: 'CATEGORY TWO',
      type: 'categories',
      type_id: 19,
      count: 2
    }
  ]

  let postsContainer = []
  for (const section of sections) {
    const res = await fetch(
      `https://reporterly.net/wp-json/wp/v2/posts?${section.type}=${section.type_id}&per_page=${section.count}&_embed=true`
    )
    const posts = await res.json()
    postsContainer.push(posts)
  }

  // console.log('POSTS CONTAINER', postsContainer)

  return {
    props: {
      ...postsContainer
    }
  }
}
