import { withRouter } from 'next/router'
import Link from 'next/link'
import React, { useState } from 'react'
import SVGCross from './SVG/SVGCross'
import SVGBurgernav from './SVG/SVGBurgernav'
import SwitchTheme from './SwitchTheme'

function Navigation({ router }) {
  const navs = [
    { text: 'Home', href: '/' },
    { text: 'About Us', href: '/about-us' },
    { text: 'Latest Stories', href: '/category/latest-stories' }
  ]

  const [display, setDisplay] = useState(false)

  return (
    <header className='flex flex-row items-center justify-between mb-4'>
      <div className='site'>
        <h1 aria-label='site-name' className='font-semibold'>
          Componentity
        </h1>
        <p aria-label='site-description' className='text-xs'>
          Just Copy & Paste
        </p>
      </div>
      <div
        className={`${
          display ? 'block' : 'hidden'
        } z-10 absolute -ml-4 mt-12 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2`}
      >
        <div className='rounded-lg shadow-lg'>
          <div className='rounded-lg shadow-xs overflow-hidden'>
            <div className='px-5 py-5 bg-gray-50 dark:bg-gray-700 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8'>
              <ul className='grid gap-3'>
                {navs.map((nav, index) => {
                  return (
                    <li key={index}>
                      <Link href={nav.href}>
                        <a
                          className={`block py-2 px-5 rounded-md text-sm font-light hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300 ${
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
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row gap-1 items-center justify-center'>
        <ul className='hidden sm:flex flex-row gap-1'>
          {navs.map((nav, index) => {
            return (
              <li key={index}>
                <Link href={nav.href}>
                  <a
                    className={`py-2 px-5 rounded-mdtext-sm font-light hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300 ${
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
        <span className='flex items-center justify-center gap-1'>
          <SwitchTheme />
          <button
            aria-label='navbar-mobile'
            onClick={() => setDisplay(!display)}
            className='sm:hidden whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150'
          >
            {display ? <SVGCross /> : <SVGBurgernav />}
          </button>
        </span>
      </div>
    </header>
  )
}
export default withRouter(Navigation)
