import { useRouter } from 'next/router'
import Link from 'next/link'

function Page({ page }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      {page === null ? (
        <h1>Not found</h1>
      ) : (
        <div>
          <h1>{page[0].title.rendered}</h1>
          <hr />
          {page[0].featured_media && page[0].featured_media !== 0 ? (
            <Image
              height={400}
              width={900}
              src={page[0]._embedded['wp:featuredmedia'][0].source_url}
              alt=''
            />
          ) : (
            <p>No Image</p>
          )}
          <article dangerouslySetInnerHTML={{ __html: page[0].content.rendered }} />
        </div>
      )}
    </>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/pages`)
  const pages = await res.json()

  const slugs = []
  pages.forEach((page) => {
    slugs.push({ params: { slug: page.slug } })
  })

  return {
    // Only `/pages/1` and `/pages/2` are generated at build time
    paths: slugs,
    // Enable statically generating additional pages
    // For example: `/pages/3`
    fallback: true
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the page `id`.
  // If the route is like /pages/1, then params.id is 1
  const { slug } = params

  const res = await fetch(`https://reporterly.net/wp-json/wp/v2/pages?_embeded=true&slug=${slug}`)
  const page = await res.json()

  // Pass page data to the page via props
  return {
    props: { page },
    // Re-generate the page at most once per second
    // if a request comes in
    revalidate: 1
  }
}

export default Page
