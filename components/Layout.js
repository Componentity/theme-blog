import Search from './SearchForm'

export default function Layout({ children }) {
  return (
    <div className='container-fluid p-0 m-0'>
      <Search />
      {children}
    </div>
  )
}
