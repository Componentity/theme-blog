import React from 'react'
import Posts from './../components/Posts'
import Head from 'next/head'

// show 2 posts of this category - done
// show 2 posts of this author - done
// show 2 posts latest - done

export default function Blog(postsContainer) {
  return Object.entries(postsContainer).map((container) => {
    // console.log('CONTAINER', container)
    return (
      <>
        <Head>
          <title>WP-NextJs Theme</title>
          <meta name='description' content='Componentity Team has made a WP-NEXTJS theme' />
          <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta httpEquiv='X-UA-Compatible' content='IE=7' />
          <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
          <meta name='robots' content='index,follow' />
          <meta name='googlebot' content='index,follow' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@componentity' />
          <meta name='twitter:creator' content='@componentity' />
          <meta property='og:url' content='http://theme-blog.vercel.app/' />
          <meta property='og:type' content='website' />
          <meta property='og:locale' content='en_US' />
          <meta property='og:site_name' content='Componentity' />
        </Head>
        <Posts
          key={Math.random().toString(36).substring(7)}
          title={container[1].name}
          slug={container[1].slug}
          type={container[1].type}
          type_id={container[1].type_id}
          totalPages={container[1].total_pages}
          paginationStyle={container[1].paginationStyle}
          perPage={container[1].count}
          posts={container[1].posts}
          section={container[1].section}
        />
      </>
    )
  })
}

export async function getStaticProps() {
  // {
  //   section: {
  //     olClasses: 'max-w-screen-md mx-auto',
  //     liType: 'default'
  //   },
  //   name: 'LIFESTYLE',
  //   slug: 'lifestyle',
  //   type: 'categories',
  //   type_id: 278,
  //   count: 2
  // }

  const sections = [
    {
      section: {
        olClasses: 'grid grid-cols-1 sm:grid-cols-12 gap-10',
        liType: 'HorizontalVariant',
        imageClasses: 'h-48'
      },
      name: 'LIFESTYLE',
      slug: 'lifestyle',
      type: 'categories',
      type_id: 278,
      paginationStyle: 'loadmore',

      count: 6
    },
    {
      section: {
        olClasses: 'grid grid-cols-3 gap-10',
        liType: 'HorizontalSmall',
        imageClasses: 'w-20 h-20'
      },
      name: 'Latest Stories',
      paginationStyle: 'pagination',

      count: 6
    }
  ]

  let postsContainer = []
  for (const section of sections) {
    let args = `_embed=true&per_page=${section.count}`
    if (section.type && section.type_id) {
      args += `&${section.type}=${section.type_id}`
    }
    //console.log('ARGS', `${process.env.NEXT_PUBLIC_SITE_URL}/posts?${args}`)

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/posts?${args}`)
    const blogs = await res.json()
    const total_pages = res.headers.get('X-WP-TotalPages')

    section['total_pages'] = total_pages
    // console.log('BLOGS INDEXJS', blogs)

    let posts = []
    for (const post of blogs) {
      const post_id = post.id
      // get categories
      const post_cats = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/categories?post=${post_id}`
      )
      const cats = await post_cats.json()
      // get tags
      const post_tags = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/tags?post=${post_id}`)
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
