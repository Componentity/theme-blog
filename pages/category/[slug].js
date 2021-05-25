import { useRouter } from 'next/router'
import Posts from './../../components/Posts'

function Category({ categories, posts }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      {categories === null ? (
        <h1>Not found</h1>
      ) : (
        <div>
          <h1>{categories[0].name}</h1>
          <hr />
          <article dangerouslySetInnerHTML={{ __html: categories[0].description }} />
          <hr />
          <Posts posts={posts} />
        </div>
      )}
    </>
  )
}

export default Category

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/categories`)
  const categories = await res.json()

  const slugs = []
  categories.forEach((category) => {
    slugs.push({ params: { slug: category.slug } })
  })

  return {
    paths: slugs,
    fallback: true
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { slug } = params
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/categories?slug=${slug}`)
  const categories = await res.json()

  // get posts of this category
  const category_id = categories[0].id
  const cat_posts = await fetch(
    `https://reporterly.net/wp-json/wp/v2/posts?categories=${category_id}`
  )
  const posts = await cat_posts.json()

  // Pass post data to the page via props
  return {
    props: { categories, posts },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}
