import React from 'react'
import ErrorPage from 'next/error'

// This is a higher-order component used in _app.js
// to globally catch errors in getInitialProps() functions
export default function withError(App) {
  const WithErrorComponent = props => {
    const {
      pageProps: { statusCode },
    } = props
    return statusCode ? (
      <ErrorPage statusCode={statusCode} />
    ) : (
      <App {...props} />
    )
  }

  WithErrorComponent.getInitialProps = async appContext => {
    let props = {}
    try {
      props = await App.getInitialProps(appContext)
    } catch (error) {
      console.log(error)
      // Capture error in getInitialProps
      props.pageProps = { statusCode: 500 }
      // make sure you handle `error` probably
    }
    const { ctx } = appContext
    if (props.pageProps.statusCode) {
      // Capture statusCode error pushed by your code in
      // the client-side script's getInitialProps
      if (ctx.res) ctx.res.statusCode = props.pageProps.statusCode
    }
    return props
  }
  WithErrorComponent.displayName = 'withError(App)'
  return WithErrorComponent
}
