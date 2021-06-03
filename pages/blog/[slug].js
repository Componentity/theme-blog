import { useRouter } from 'next/router'
import Link from 'next/link'
import ImageComponentity from './../../components/ImageComponentity'
import ResponsiveArticle from './../../components/skeleton/ResponsiveArticle'
import SVGCategory from './../../components/SVG/SVGCategory'
import SVGAuthor from './../../components/SVG/SVGAuthor'
import SVGClock from './../../components/SVG/SVGClock'
import Head from 'next/head'
import ReactHtmlParser from 'react-html-parser'

function Post({ post, cats, tags }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <ResponsiveArticle />
  }

  return (
    <>
      {post === null ? (
        <h1>Not found</h1>
      ) : (
        <div className='mb-10 rounded overflow-hidden flex flex-col mx-auto'>
          <Head>{ReactHtmlParser(post[0].yoast_head)}</Head>
          <header>
            <h1 className='text-4xl font-bold mb-4 dark:text-gray-50'>{post[0].title.rendered}</h1>
            <hr />
            <div className='py-5 text-sm font-regular text-gray-900 flex'>
              <Link href={`/author/${encodeURIComponent(post[0]._embedded.author[0].slug)}`}>
                <a
                  aria-label='Author'
                  className='mr-3 flex flex-row gap-1 items-center hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-600'
                >
                  <SVGAuthor color='indigo-600' />
                  <span>{post[0]._embedded.author[0].name}</span>
                </a>
              </Link>
              <span className='mr-3 flex flex-row items-center dark:text-gray-300'>
                <SVGClock />
                <span className='ml-1'>{post[0].date}</span>
              </span>
              {cats.length > 0 && (
                <span className='flex flex-row items-center hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-600'>
                  <SVGCategory />
                  {cats.map((cat) => {
                    return (
                      <span className='ml-1' key={cat.id}>
                        <Link href={`/category/${cat.slug}`}>
                          <a aria-label='Category'>{cat.name}</a>
                        </Link>
                      </span>
                    )
                  })}
                </span>
              )}
            </div>
          </header>
          {post[0].featured_media != 0 && post[0].featured_media ? (
            <ImageComponentity
              src={post[0]._embedded['wp:featuredmedia'][0].source_url}
              alt={post[0].title.rendered}
            />
          ) : (
            ''
          )}
          <div
            className='text-gray-700 py-5 text-base leading-8 dark:text-gray-300'
            dangerouslySetInnerHTML={{ __html: post[0].content.rendered }}
          />
          <hr />
          {tags.length > 0 && (
            <span className='flex flex-row items-center hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-600'>
              <SVGCategory />
              {tags.map((tag) => {
                return (
                  <span className='ml-1' key={tag.id}>
                    <Link href={`/tag/${tag.slug}`}>
                      <a aria-label='Tag'>{tag.name}</a>
                    </Link>
                  </span>
                )
              })}
            </span>
          )}
        </div>
      )}
    </>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`${process.env.SITE_URL}/posts`)
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

  const res = await fetch(`${process.env.SITE_URL}/posts?slug=${slug}&_embed=true`)
  const post = await res.json()

  const post_id = post[0].id

  // get categories
  const post_cats = await fetch(`${process.env.SITE_URL}/categories?post=${post_id}`)
  const cats = await post_cats.json()

  // get tags
  const post_tags = await fetch(`${process.env.SITE_URL}/tags?post=${post_id}`)
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
