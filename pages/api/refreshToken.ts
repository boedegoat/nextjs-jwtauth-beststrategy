import { NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'
import { accessTokenSecret, refreshTokenSecret } from 'data'
import { setCookie } from 'lib/cookies'

const refreshToken: NextApiHandler = (req, res) => {
  // read refreshToken cookie
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.status(401).json({ status: 401, message: 'refreshToken missing' })
    return
  }

  // verify it
  jwt.verify(refreshToken, refreshTokenSecret, (err, userPayload: any) => {
    // if error (refreshToken expired or invalid) => redirect to login page
    if (err) {
      throw err
    }

    const { id, name } = userPayload

    // otherwise, create new accessToken
    const newAccessToken = jwt.sign({ id, name }, accessTokenSecret, {
      expiresIn: '1m',
    })

    // set new accessTokenLife cookie
    setCookie(res, 'accessTokenLife', 1 * 60 * 1000, {
      path: '/', // makes cookie persist accross the site
      maxAge: 1 * 60 * 1000, // minute * second * 1000 = ms
      secure: process.env.NODE_ENV === 'production', // use https if production
    })
    res.status(200).json({ id, name, accessToken: newAccessToken })
  })
}

export default refreshToken
