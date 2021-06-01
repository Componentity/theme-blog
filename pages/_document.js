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
          <title>WP-NextJs Theme</title>
          <meta name='description' content='Componentity Team has made a WP-NEXTJS theme' />
          <meta http-equiv='Content-Type' content='text/html;charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta http-equiv='X-UA-Compatible' content='IE=7' />
          <meta http-equiv='X-UA-Compatible' content='ie=edge' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
