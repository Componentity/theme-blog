import SearchForm from './SearchForm'

export default function Layout({ children }) {
  return (
    <div className='max-w-screen-md mx-auto'>
      <SearchForm />
      <br />
      <br />
      {children}
    </div>
  )
}
