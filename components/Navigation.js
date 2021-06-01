import { withRouter } from 'next/router'
import Link from 'next/link'

function Navigation({ router }) {
  const navs = [
    { text: 'Home', href: '/' },
    { text: 'About Us', href: '/about-us' },
    { text: 'Latest Stories', href: '/category/latest-stories' }
  ]
  return (
    <header className='flex sm:flex-row justify-between'>
      <div className='site'>
        <h1 aria-label='site-name'>WPTHEME</h1>
        <p aria-label='site-description' className='description'>
          some description for the blog
        </p>
      </div>
      <ul className='flex flex-row gap-1'>
        {navs.map((nav, index) => {
          return (
            <li key={index}>
              <Link href={nav.href}>
                <a
                  className={`py-2 px-5 rounded-mdtext-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    router.pathname == nav.href
                      ? 'bg-indigo-600 text-gray-50 hover:text-gray-700'
                      : 'text-gray-700'
                  }`}
                  aria-label='nav link'
                >
                  {nav.text}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </header>
  )
}
export default withRouter(Navigation)
