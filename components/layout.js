import React from 'react'
import Head from 'next/head'
import MainNav from '~/components/mainNav'
import { makeStyles } from '@material-ui/core'

const cssLayout = makeStyles(theme => ({
  container: {
    maxWidth: '65rem',
    margin: '64px auto 0 auto',
    padding: '1rem',
  },
}))

const Layout = props => {
  const css = cssLayout()

  return (
    <React.Fragment>
      <Head>
        <title>With Cookies</title>
      </Head>
      <MainNav token={props.token} onPage={props.onPage} />

      <main>
        <div className={css.container}>{props.children}</div>
      </main>
    </React.Fragment>
  )
}

export default Layout
