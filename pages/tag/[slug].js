import { useRouter } from 'next/router'
import Posts from './../../components/Posts'

function Tag({ tags, posts }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      {tags.length === 0 ? (
        <h1>My Custom 404 Page</h1>
      ) : (
        <div>
          <h1>{tags[0].name}</h1>
          <hr />
          <article dangerouslySetInnerHTML={{ __html: tags[0].description }} />
          <hr />
          <Posts posts={posts} />
        </div>
      )}
    </>
  )
}

export default Tag

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/tags`)
  const tags = await res.json()

  const slugs = []
  tags.forEach((tag) => {
    slugs.push({ params: { slug: tag.slug } })
  })

  return {
    paths: slugs,
    fallback: true
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { slug } = params
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/tags?slug=${slug}`)
  const tags = await res.json()

  // get posts of this tag
  let posts = null
  if (tags.length > 0) {
    const tag_id = tags[0].id
    const tag_posts = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?tags=${tag_id}`)
    posts = await tag_posts.json()
  }

  // Pass post data to the page via props
  return {
    props: { tags, posts },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}
