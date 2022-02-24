import { User } from 'entity/User'
import Boom from '@hapi/boom'

import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
  VerifyCallbackWithRequest,
} from 'passport-jwt'

const jwtSecret = process.env.JWT_SECRET as string

const extractJWT = ExtractJWT.fromAuthHeaderAsBearerToken()

export const passportJwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: extractJWT,
    secretOrKey: jwtSecret,
    passReqToCallback: true,
  },
  <VerifyCallbackWithRequest>(async (req, token, done) => {
    const rawToken = extractJWT(req)!
    const user = await User.findOne({ id: token.id })
    if (!user) {
      return done(Boom.unauthorized())
    }

    try {
      return done(null, user, { token, rawToken })
    } catch (error) {
      return done(error)
    }
  }),
)
