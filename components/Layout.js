import Header from './Header'

export default function Layout({ children }) {
  return (
    <>
      <div className='max-w-screen-xl mx-auto pt-5 px-5'>
        <Header />
        {children}
      </div>
    </>
  )
}
