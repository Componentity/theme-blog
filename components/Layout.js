import Header from './Header'

export default function Layout({ children }) {
  return (
    <>
      <div className='max-w-screen-lg mx-auto pt-5 px-5'>
        <Header />
      </div>
      <div className='max-w-screen-md mx-auto p-5'>{children}</div>
    </>
  )
}
