import React from 'react'
import Posts from './../components/Posts'

// show 2 posts of this category - done
// show 2 posts of this author - done
// show 2 posts latest - done
export default function Blog(postsContainer) {
  return Object.entries(postsContainer).map((container) => {
    // console.log('CONTAINER', container)
    return (
      <Posts
        key={Math.random().toString(36).substring(7)}
        title={container[1].name}
        slug={container[1].slug}
        type={container[1].type}
        type_id={container[1].type_id}
        posts={container[1].posts}
      />
    )
  })
}

export async function getStaticProps() {
  const sections = [
    {
      name: 'CATEGORY TWO',
      slug: 'blog',
      type: 'categories',
      type_id: 19,
      count: 2
    },
    {
      name: 'AUTHOR',
      slug: 'newsfeed',
      type: 'author',
      type_id: 7,
      count: 2
    },
    { count: 2 }
  ]

  let postsContainer = []
  for (const section of sections) {
    const args = `${section.type}=${section.type_id}&per_page=${section.count}&_embed=true`
    const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?${args}`)
    const posts = await res.json()
    postsContainer.push({
      ...section,
      posts: posts
    })
  }

  // console.log('POSTS CONTAINER', ...postsContainer)

  return {
    props: {
      ...postsContainer
    }
  }
}
