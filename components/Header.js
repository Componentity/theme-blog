import { withRouter } from 'next/router'
import Link from 'next/link'
import React, { useState } from 'react'
import SVGCross from './SVG/SVGCross'
import SVGBurgernav from './SVG/SVGBurgernav'
import SwitchTheme from './SwitchTheme'
import SearchForm from './SearchForm'

function Header({ router }) {
  const navs = [
    { text: 'Home', href: '/' },
    { text: 'Mcgivney Festival', href: '/mcgivneyfestival' },
    { text: 'Catholic App', href: '/catholic-app' }
  ]

  const [display, setDisplay] = useState(false)

  return (
    <>
      <header className='flex flex-row items-center justify-between mb-4 relative'>
        <Link href={'/'}>
          <a>
            <div className='site hover:text-indigo-600'>
              <h1 aria-label='site-name' className='font-semibold'>
                Componentity
              </h1>
              <p aria-label='site-description' className='text-xs'>
                Just Copy & Paste
              </p>
            </div>
          </a>
        </Link>
        <div
          className={`z-10 ${display ? 'fixed' : 'hidden'} inset-0 overflow-hidden`}
          aria-labelledby='slide-over-title'
          role='dialog'
          aria-modal='true'
        >
          <div className='absolute inset-0 overflow-hidden'>
            <div
              className='absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
              aria-hidden='true'
            ></div>

            <div className='fixed inset-y-0 left-0 pr-20 max-w-full flex'>
              <div className='relative w-screen max-w-md'>
                <div className='h-full flex flex-col py-6 bg-white dark:bg-gray-700 shadow-xl overflow-y-scroll'>
                  <div className='px-4 sm:px-6'>
                    <h2
                      className='pl-4 text-lg font-medium text-gray-900 dark:text-white'
                      id='slide-over-title'
                    >
                      Panel title
                    </h2>
                  </div>
                  <div className='mt-6 relative flex-1 px-4 sm:px-6'>
                    <div className='absolute inset-0 px-4 sm:px-6'>
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
                      className={`py-2 px-5 rounded-md text-sm font-light hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-100 dark:hover:text-gray-900 ${
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
            <SearchForm />
            <button
              aria-label='navbar-mobile'
              onClick={() => setDisplay(!display)}
              className='sm:hidden z-10 whitespace-no-wrap fixed bottom-4 right-4 w-12 h-12 flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150'
            >
              {display ? <SVGCross /> : <SVGBurgernav />}
            </button>
          </span>
        </div>
      </header>
    </>
  )
}
export default withRouter(Header)
