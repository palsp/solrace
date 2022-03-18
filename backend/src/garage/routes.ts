import express from 'express'
import _ from 'lodash'
import { notFound } from '@hapi/boom'
import { Kart } from 'entity/Kart'
import { NFTMetaData } from 'entity/NFTMetadata'
import { Garage } from 'entity/Garage'
import { passportJwtMiddlewareAuth } from 'auth/middleware'
import { getGarageByTokenId } from 'garage/services'

const router = express.Router()

router.get('/:tokenId', async (req, res, next) => {
  try {
    const result = await getGarageByTokenId(req.params.tokenId)

    res.send(result)
  } catch (e) {
    console.log(e)
    next(e)
  }
})

export default router
