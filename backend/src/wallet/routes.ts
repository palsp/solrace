import express from 'express'
import _ from 'lodash'

import { passportJwtMiddlewareAuth } from 'auth/middleware'
import { getOrCreateUserNonce, verifySignature } from 'wallet/services'

const router = express.Router()

router.use(passportJwtMiddlewareAuth())

router.get('/nonce', async (req, res, next) => {
  try {
    const userNonce = await getOrCreateUserNonce(req.user!)
    const cleanUserNonce = _.omit(userNonce, ['id'])
    res.send(cleanUserNonce)
  } catch (e) {
    next(e)
  }
})

router.post('/verify-signature', async (req, res, next) => {
  try {
    const { signature, publicAddress } = req.body

    const userNonce = await getOrCreateUserNonce(req.user!)
    await verifySignature(publicAddress, userNonce, signature.data)
    res.send(200)
  } catch (e) {
    next(e)
  }
})

export default router
