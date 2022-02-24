import express from 'express'
import { passportJwtMiddlewareAuth } from 'auth/middleware'
import _ from 'lodash'

import { User } from 'entity/User'

const router = express.Router()

router.get('/info', passportJwtMiddlewareAuth(), async (req, res, next) => {
  try {
    const userData = _.pick(req.user!, ['id', 'email'])
    res.send(userData)
  } catch (e) {
    next(e)
  }
})

export default router
