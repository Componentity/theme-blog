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
  // {
  //   name: 'CATEGORY TWO',
  //   slug: 'blog',
  //   type: 'categories',
  //   type_id: 19,
  //   count: 2
  // },
  // {
  //   name: 'AUTHOR',
  //   slug: 'newsfeed',
  //   type: 'author',
  //   type_id: 7,
  //   count: 2
  // },
  // {
  // count: 2
  // }

  const sections = [
    {
      count: 5
    }
  ]

  let postsContainer = []
  for (const section of sections) {
    let args = `_embed=true&per_page=${section.count}`
    if (section.type && section.type_id) {
      args += `&${section.type}=${section.type_id}`
    }
    // console.log('ARGS', args)
    const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?${args}`)
    const blogs = await res.json()
    // console.log('BLOGS INDEXJS', blogs)

    let posts = []
    for (const post of blogs) {
      const post_id = post.id
      // get categories
      const post_cats = await fetch(
        `https://reporterly.net/wp-json/wp/v2/categories?post=${post_id}`
      )
      const cats = await post_cats.json()
      // get tags
      const post_tags = await fetch(`https://reporterly.net/wp-json/wp/v2/tags?post=${post_id}`)
      const tags = await post_tags.json()

      posts.push({ blog: post, cats, tags })
    }

    // console.log('BLOGS PASSED TO POSTS.JS: ', posts)

    // console.log('SECTOIN', section)

    postsContainer.push({
      ...section,
      posts: posts
    })
    // console.log('POSTS CONTAINER', postsContainer)
  }

  // console.log('POSTS CONTAINER', ...postsContainer)

  return {
    props: {
      ...postsContainer
    }
  }
}
