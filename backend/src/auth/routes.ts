import express from 'express'
import _ from 'lodash'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import { User } from 'entity/User'
import { getConnection } from 'typeorm'
import { signJWT } from 'auth'
import { PostgresError } from 'pg-error-enum'
import { passportJwtStrategy } from 'auth/passport-strategy'

const router = express.Router()

passport.use(passportJwtStrategy)

router.post('/signup', async (req, res, next) => {
  try {
    const { password, email } = req.body
    if (password.length <= 8) {
      next(
        Boom.conflict('Please use a password that has at least 8 characters'),
      )
      return
    }

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
})

router.post('/login', async (req, res, next) => {
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
})

export default router
