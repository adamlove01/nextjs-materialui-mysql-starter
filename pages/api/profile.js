import fetch from 'isomorphic-unfetch'
import Cors from 'micro-cors'
import { decryptTokenData } from '~/utils/auth'

const cors = Cors({
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Origin, Accept, Content-Type, Authorization'],
  origin: process.env.API_HOST,
  maxAge: 86400,
})

export default async (req, res) => {
  if (!('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing')
  }

  const token = await req.headers.authorization
  if (token) {
    // If this were a userID, we would also verify
    // that the user exists in the database
  } else {
    // Unauthorized
    return res.json({ statusCode: 401, error: 'Unauthorized' })
  }

  try {
    const githubId = decryptTokenData(token)
    const url = `https://api.github.com/user/${githubId}`

    const response = await fetch(url)

    if (response.ok) {
      const js = await response.json()
      // Need camelcase in the frontend
      const data = Object.assign({}, { avatarUrl: js.avatar_url }, js)
      return res.status(200).json({ data })
    } else {
      return res.json({ statusCode: 401, error: response.statusText })
    }
  } catch (error) {
    return res.json({ statusCode: 400, error: error.message })
  }
}
