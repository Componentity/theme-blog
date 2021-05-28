import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

function Search() {
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
    <form onSubmit={(e) => onSubmitHandler(e)}>
      <input
        type='text'
        name='search'
        placeholder='Search...'
        onChange={(e) => inputHandler(e)}
        value={search}
      />
      <button disabled={disabled} type='submit' onClick={(e) => onSubmitHandler(e)}>
        {loading ? 'loading...' : 'Submit'}
      </button>
    </form>
  )
}

export default Search
