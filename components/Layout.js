import SearchForm from './SearchForm'

export default function Layout({ children }) {
  return (
    <div className='max-w-screen-md mx-auto p-5'>
      <SearchForm />
      <br />
      <br />
      {children}
    </div>
  )
}
