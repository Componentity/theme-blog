import '../styles/globals.css'
import Layout from '../components/Layout'
import Router from 'next/router'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import NProgress from 'nprogress' //nprogress module
import 'nprogress/nprogress.css' //styles of nprogress

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute='class'>
        <Head>
          <title>WP-NextJs Theme</title>
          <meta name='description' content='Componentity Team has made a WP-NEXTJS theme' />
          <meta http-equiv='Content-Type' content='text/html;charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta http-equiv='X-UA-Compatible' content='IE=7' />
          <meta http-equiv='X-UA-Compatible' content='ie=edge' />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp
