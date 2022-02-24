import express from 'express'
import _ from 'lodash'

import { passportJwtMiddlewareAuth } from 'auth/middleware'
import {
  addWallet,
  deleteWallet,
  getOrCreateUserNonce,
  getWallet,
  verifySignature,
} from 'wallet/services'

const router = express.Router()

router.use(passportJwtMiddlewareAuth())

router.get('/', async (req, res, next) => {
  try {
    const wallet = await getWallet(req.user!)
    if (wallet) {
      res.send(_.omit(wallet, 'id'))
      return
    }
    res.status(200).send('null')
  } catch (e) {
    next(e)
  }
})

router.post('/sync', async (req, res, next) => {
  const { publicAddress, signature } = req.body
  try {
    const wallet = await addWallet(req.user!, publicAddress, signature.data)
    res.send(wallet)
  } catch (e) {
    next(e)
  }
})

router.post('/un-sync', async (req, res, next) => {
  const { signature } = req.body
  try {
    const wallet = await deleteWallet(req.user!, signature.data)
    res.send(wallet)
  } catch (e) {
    next(e)
  }
})

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
