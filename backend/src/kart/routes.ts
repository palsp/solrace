import _ from 'lodash'
import { Wallet } from 'entity/Wallet'
import { passportJwtMiddlewareAuth } from 'auth/middleware'
import express from 'express'
import {
  getKartByTokenId,
  getKartOfOwner,
  updateKartOwnerBatch,
} from 'kart/services'
import { badRequest, notFound } from '@hapi/boom'
import { Kart } from 'entity/Kart'
import { NFTMetaData } from 'entity/NFTMetadata'

const router = express.Router()

router.get('/:tokenId', async (req, res, next) => {
  try {
    const result = await getKartByTokenId(req.params.tokenId)
    res.send(result)
  } catch (e) {
    next(e)
  }
})
router.put('/refresh/:publicAddress', async (req, res, next) => {
  try {
    await updateKartOwnerBatch(req.params.publicAddress)
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

router.use(passportJwtMiddlewareAuth())

router.get('/', async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user })
    if (!wallet) {
      next(badRequest('no sync wallet'))
      return
    }
    const results = await getKartOfOwner(wallet.publicAddress)

    res.send({ results })
  } catch (e) {
    next(e)
  }
})

export default router
