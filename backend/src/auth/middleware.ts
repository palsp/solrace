import passport from 'passport'
import Boom from '@hapi/boom'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const passportJwtMiddlewareAuth = ({
  noAuth = false,
} = {}): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    async (err, user, payload) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        if (noAuth) {
          return next()
        }
        return next(Boom.unauthorized())
      }

      req.user = user

      return next()
    },
  )(req, res, next)
}
