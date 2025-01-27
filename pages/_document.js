import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='description' content='A Coffee Store near you' />
          <link rel='icon' href='/static/coffee.png' />
          <link
            rel='preload'
            href='/fonts/Charm-bold.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
          <link
            rel='preload'
            href='/fonts/Gordon-Black.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
          <link
            rel='preload'
            href='/fonts/PlayfairDisplay-Regular.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
          <link
            rel='preload'
            href='/fonts/PlayfairDisplay-Bold.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
          <link
            rel='preload'
            href='/fonts/PlayfairDisplay-SemiBold.ttf'
            as='font'
            crossOrigin='anonymous'
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
