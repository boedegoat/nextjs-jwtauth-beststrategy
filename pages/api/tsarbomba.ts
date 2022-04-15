import { accessTokenSecret } from 'data'
import jwt from 'jsonwebtoken'
import { NextApiHandler } from 'next'

const tsarbomba: NextApiHandler = (req, res) => {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw { status: 401, message: 'missing authorization' }
  }

  const token = authorization.split(' ')[1]

  // verify the token
  jwt.verify(token, accessTokenSecret)

  res.status(200).json({
    tsarbomba: '💣 tsarbomba',
  })
}

export default tsarbomba
