import React from 'react'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import Layout from '~/components/layout'
import { withAuthSync } from '~/utils/auth'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 300,
    margin: 'auto',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const Profile = props => {
  const css = useStyles()
  const { name, login, bio, avatarUrl } = props.data

  return (
    <Layout token={props.token} onPage="profile">
      <Card className={css.root}>
        <CardContent>
          <img src={avatarUrl} alt="Avatar" />
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography className={css.pos} color="textSecondary">
            {login}
          </Typography>
          <Typography variant="body2" component="p">
            {bio}
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Layout>
  )
}

Profile.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx)
  const host = process.env.API_HOST
  const apiUrl = `${host}/api/profile`

  const data = await fetch(apiUrl, {
    credentials: 'include',
    headers: {
      Authorization: token,
    },
  })

  const result = await data.json()

  // If the API returns an error statusCode, pass it along
  // to the withError() High-order component in _app.js,
  // which will load an error page
  if (result.statusCode) {
    return { statusCode: result.statusCode }
  }

  return result
}

export default withAuthSync(Profile)
