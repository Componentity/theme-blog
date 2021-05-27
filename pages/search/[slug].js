import { useRouter } from 'next/router'
import Posts from './../../components/Posts'

function Search({ posts }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
          <Posts posts={posts} />
    </>
  )
}

export default Search

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?_embed=true`)
  const posts = await res.json()

  const slugs = []
  posts.forEach((post) => {
    slugs.push({ params: { slug: post.slug } })
  })

  return {
    paths: slugs,
    fallback: true
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { slug } = params
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/posts?search=${slug}&_embed=true`)
  const posts = await res.json()

  // Pass post data to the page via props
  return {
    props: { posts },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}
