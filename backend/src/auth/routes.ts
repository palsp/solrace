import express from 'express'
import _ from 'lodash'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { User } from 'entity/User'
import { getConnection } from 'typeorm'
import { signJWT } from 'auth'
import { PostgresError } from 'pg-error-enum'
import { passportJwtStrategy } from 'auth/passport-strategy'
import { validate } from 'utils/validator'

const router = express.Router()

passport.use(passportJwtStrategy)

router.post(
  '/signup',
  validate.body(
    Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(8).required(),
    }),
  ),
  async (req, res, next) => {
    try {
      const { password, email } = req.body

      await getConnection().transaction(async (manager) => {
        const user = await manager.save(
          User.create({
            email: _.toLower(email),
            password: bcrypt.hashSync(password, 10),
          }),
        )

        const cleanDataUser = _.omit(user, ['id', 'password'])
        const token = signJWT(user as User)

        res.send({ ...cleanDataUser, token })
      })
    } catch (e) {
      if ((e as any).code === PostgresError.UNIQUE_VIOLATION) {
        next(Boom.conflict('This email is already in used'))
      } else {
        next(e)
      }
    }
  },
)

router.post(
  '/login',
  validate.body(
    Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(8).required(),
    }),
  ),
  async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await User.findOneWithCredentialByEmail({ email })
      if (!user) {
        next(Boom.notFound())
        return
      }

      const isValidPassword = await user.validatePassword(password)
      if (!isValidPassword) {
        next(Boom.badRequest('Wrong email or password'))
        return
      }

      const token = signJWT(user)
      const userData = _.pick(user, ['email', 'id'])

      res.send({ ...userData, token })
    } catch (e) {
      next(e)
    }
  },
)

export default router
