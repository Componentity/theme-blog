import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

function SearchForm() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)

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
    <form
      className='flex flex-col sm:flex-row sm:items-center gap-2'
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
  )
}

export default SearchForm
