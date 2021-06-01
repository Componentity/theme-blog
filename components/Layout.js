import SearchForm from './SearchForm'
import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className='max-w-screen-md mx-auto p-5'>
      <Navigation />
      <SearchForm />
      <br />
      <br />
      {children}
    </div>
  )
}
