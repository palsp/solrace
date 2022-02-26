import jwt from 'jsonwebtoken'
import { User } from 'entity/User'

export function signJWT(user: User, expiresIn = process.env.JWT_EXPIRES_IN) {
  const { id, email } = user
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn,
    },
  )
}
