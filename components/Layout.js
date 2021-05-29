import Search from './Search'
// search name changed to upper case

export default function Layout({ children }) {
  return (
    <div className='container-fluid p-0 m-0'>
      <Search />
      {children}
    </div>
  )
}
