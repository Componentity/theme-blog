import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

function SwitchTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      aria-label='Toggle Dark Mode'
      type='button'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          stroke='currentColor'
          className='h-8 w-8 dark:text-gray-100 text-gray-200'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          ></path>
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          stroke='currentColor'
          className='h-8 w-8 dark:text-gray-800 text-gray-200'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
          ></path>
        </svg>
      )}
    </button>
  )
}

export default SwitchTheme
