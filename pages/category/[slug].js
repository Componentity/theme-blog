import { useRouter } from 'next/router'
import Posts from './../../components/Posts'
import ResponsiveArticle from './../../components/skeleton/ResponsiveArticle'

function Category({ categories, posts, category_id, total_pages }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <ResponsiveArticle />
  }

  return (
    <>
      {categories.length === 0 ? (
        <h1>My Custom 404 Page</h1>
      ) : (
        <div>
          <h1 className='text-xl font-bold uppercase mb-2'>{categories[0].name}</h1>
          <hr className='mb-2 h-2 w-40' />
          <article dangerouslySetInnerHTML={{ __html: categories[0].description }} />
          <hr className='my-4' />
          <Posts
            posts={posts}
            type='categories'
            type_id={category_id}
            totalPages={total_pages}
            paginationStyle='pagination'
          />
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
  let category_id = null
  let total_pages = null
  let posts = []

  if (categories.length > 0) {
    category_id = categories[0].id
    const cat_posts = await fetch(
      `https://reporterly.net/wp-json/wp/v2/posts?categories=${category_id}&_embed=true`
    )
    const blogs = await cat_posts.json()
    total_pages = cat_posts.headers.get('X-WP-TotalPages')

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
  }

  // Pass post data to the page via props
  return {
    props: { categories, posts, category_id, total_pages },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1
  }
}
