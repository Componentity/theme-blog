import { useRouter } from 'next/router'
import Posts from './../../components/Posts'
import ResponsiveArticle from './../../components/skeleton/ResponsiveArticle'

function Search({ posts, slug, total_pages }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <ResponsiveArticle />
  }

  return (
    <>
      <Posts
        posts={posts}
        title={slug}
        slug={slug}
        type='search'
        type_id={slug}
        totalPages={total_pages}
        paginationStyle='pagination'
      />
    </>
  )
}

export default Search

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`${process.env.SITE_URL}/posts?_embed=true`)
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
  const res = await fetch(`${process.env.SITE_URL}/posts?search=${slug}&_embed=true`)
  const blogs = await res.json()
  const total_pages = res.headers.get('X-WP-TotalPages')

  const posts = []
  for (const post of blogs) {
    const post_id = post.id
    // get categories
    const post_cats = await fetch(`${process.env.SITE_URL}/categories?post=${post_id}`)
    const cats = await post_cats.json()
    // get tags
    const post_tags = await fetch(`${process.env.SITE_URL}/tags?post=${post_id}`)
    const tags = await post_tags.json()

    posts.push({ blog: post, cats, tags })
  }

  // Pass post data to the page via props
  return {
    props: { posts, slug, total_pages },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}
