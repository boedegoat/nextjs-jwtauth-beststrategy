import { NextApiHandler } from 'next'
import { accessTokenSecret, refreshTokenSecret, users } from 'data'
import jwt from 'jsonwebtoken'
import { setCookie, setCookies } from 'lib/cookies'

const login: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    throw { status: 500, message: 'Only accept POST method' }
  }

  // get { name, password } from req.body
  const { name, password } = req.body

  // find user from users
  const user = users.find((user) => user.name == name)

  if (!user) {
    throw { status: 404, message: 'User is not exist' }
  }

  // check if password correct
  if (user.password !== password) {
    throw { status: 401, message: 'Wrong password' }
  }

  const userPayload = { id: user.id, name: user.name }

  // create accessToken and refreshToken
  const accessToken = jwt.sign(userPayload, accessTokenSecret, {
    expiresIn: '1m', // short live, only 1 minute
  })
  const refreshToken = jwt.sign(userPayload, refreshTokenSecret, {
    expiresIn: '30d', // long live, up to 30 day
  })

  setCookies(res, [
    // store accessToken life to public cookie
    {
      name: 'accessTokenLife',
      value: 1 * 60 * 1000,
      options: {
        path: '/', // makes cookie persist accross the site
        maxAge: 1 * 60 * 1000, // minute * second * 1000 = ms
        secure: process.env.NODE_ENV === 'production', // use https if production
      },
    },
    // refreshToken is used to create a new accessToken when accessToken is expired
    {
      name: 'refreshToken',
      value: refreshToken,
      options: {
        path: '/', // makes cookie persist accross the site
        httpOnly: true, // makes cookie can't be accessible on client-side, helps us prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // use https if production
        maxAge: 30 * 24 * 60 * 60 * 1000, // days * hour * minute * second * 1000 = ms
        sameSite: 'strict', // can't be use on different site, helps us prevent CSRF attacks
      },
    },
  ])

  res.status(200).json({
    id: user.id,
    name: user.name,
    accessToken,
  })
}

export default login
