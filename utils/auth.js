import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'

export const encryptTokenData = tokenData => {
  return jwt.sign(tokenData, process.env.AUTH_SECRET)
}

export const decryptTokenData = token => {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET)
  } catch (e) {
    console.log('e:', e)
    return null
  }
}

export const login = ({ token }) => {
  cookie.set('token', token, { expires: 1 })
  // Send to preferred landing page
  Router.push('/wordlist/1')
}

export const hasAuthToken = ctx => {
  const { token } = nextCookie(ctx)

  // If there's no token, it means the user is not logged in.
  if (!token) {
    if (typeof window === 'undefined') {
      // Server side error
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
    } else {
      // Client side error
      Router.push('/')
    }
  }

  return token
}

export const logout = () => {
  cookie.remove('token')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
  Router.push('/')
}

// Higher-order component to verify login
export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        Router.push('/')
      }
    }

    useEffect(() => {
      window.addEventListener('storage', syncLogout)

      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    const token = hasAuthToken(ctx)

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, token }
  }

  return Wrapper
}
