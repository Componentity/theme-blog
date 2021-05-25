import { useRouter } from 'next/router'
import Link from 'next/link'

function Post({ post, cats }) {
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
          <article dangerouslySetInnerHTML={{ __html: post[0].content.rendered }} />
        </div>
      )}
    </>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?_embed=true`)
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

  // get categories
  const post_id = post[0].id
  const post_cats = await fetch(`https://reporterly.net/wp-json/wp/v2/categories?post=${post_id}`)
  const cats = await post_cats.json()

  // Pass post data to the page via props
  return {
    props: { post, cats },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}

export default Post
