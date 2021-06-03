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
          <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta httpEquiv='X-UA-Compatible' content='IE=7' />
          <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
          <meta name='robots' content='index,follow' />
          <meta name='googlebot' content='index,follow' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@componentity' />
          <meta name='twitter:creator' content='@componentity' />
          <meta property='og:url' content='http://theme-blog.vercel.app/' />
          <meta property='og:type' content='website' />
          <meta property='og:locale' content='en_US' />
          <meta property='og:site_name' content='Componentity' />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp
