import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

function Post({ post, cats, tags }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      {post === null ? (
        <h1>Not found</h1>
      ) : (
        <div>
          <h1>{post[0].title.rendered}</h1>
          <hr />
          <ul>
            <li>
              <Link href={`/author/${encodeURIComponent(post[0]._embedded.author[0].slug)}`}>
                <a>Author: {post[0]._embedded.author[0].name}</a>
              </Link>
            </li>
          </ul>
          <hr />
          <p>Categories: </p>
          <ul>
            {cats.map((cat) => {
              return (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`}>
                    <a>{cat.name}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
          <hr />
          <p>Tags: </p>
          <ul>
            {tags.map((tag) => {
              return (
                <li key={tag.id}>
                  <Link href={`/tag/${tag.slug}`}>
                    <a>{tag.name}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
          <hr />
          {post[0].featured_media && post[0].featured_media ? (
            <Image
              height={400}
              width={900}
              src={post[0]._embedded['wp:featuredmedia'][0].source_url}
              alt=''
            />
          ) : (
            <p>No Image</p>
          )}
          <hr />
          <article dangerouslySetInnerHTML={{ __html: post[0].content.rendered }} />
        </div>
      )}
    </>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts`)
  const posts = await res.json()

  const slugs = []
  posts.forEach((post) => {
    slugs.push({ params: { slug: post.slug } })
  })

  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: slugs,
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const { slug } = params

  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?slug=${slug}&_embed=true`)
  const post = await res.json()

  const post_id = post[0].id

  // get categories
  const post_cats = await fetch(`https://reporterly.net/wp-json/wp/v2/categories?post=${post_id}`)
  const cats = await post_cats.json()

  // get tags
  const post_tags = await fetch(`https://reporterly.net/wp-json/wp/v2/tags?post=${post_id}`)
  const tags = await post_tags.json()

  // Pass post data to the page via props
  return {
    props: { post, cats, tags },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}

export default Post
