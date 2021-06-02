import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SVGCross from './SVG/SVGCross'
import SVGSearch from './SVG/SVGSearch'

function SearchForm() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [display, setDisplay] = useState(false)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (search && search != '' && !loading && !disabled) {
      setLoading(true)
      setDisabled(true)
      router.push(`/search/${search}`)
    }
  }

  useEffect(() => {
    setLoading(false)
    setSearch('')
  }, [router])

  const inputHandler = (e) => {
    let str = e.target.value
    str = str.replace(/^\s+/, '')
    if (e.target.value == '') {
      setDisabled(true)
      setSearch('')
    } else {
      setSearch(str)
      setDisabled(false)
    }
  }
  // errors
  // onChange => one letter is not changable
  // once in the search page, the second search is not working

  return (
    <>
      <button
        aria-label='navbar-mobile'
        onClick={() => setDisplay(!display)}
        className='whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150'
      >
        {display ? <SVGCross /> : <SVGSearch />}
      </button>

      <div
        className={`${
          display ? 'block' : 'hidden'
        } z-10 absolute -ml-60 mt-48 md:mt-32 transform px-2 w-screen max-w-5xl sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2`}
      >
        <div className='rounded-lg shadow-lg'>
          <div className='rounded-lg shadow-xs overflow-hidden'>
            <div className='px-5 py-5 bg-gray-50 dark:bg-gray-700 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8'>
              <form
                className='w-full flex flex-col sm:flex-row sm:items-center gap-2'
                onSubmit={(e) => onSubmitHandler(e)}
              >
                <input
                  type='text'
                  name='search'
                  placeholder='Search...'
                  onChange={(e) => inputHandler(e)}
                  value={search}
                  className='py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md'
                />
                <button
                  className='bg-white py-2 px-5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  disabled={disabled}
                  type='submit'
                  onClick={(e) => onSubmitHandler(e)}
                >
                  {loading ? 'loading...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchForm
