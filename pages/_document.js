import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='preload'
            href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap'
            rel='stylesheet'
          />
        </Head>
        <body className='dark:bg-gray-900 dark:text-gray-50'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
