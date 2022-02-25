import express from 'express'
import Boom from '@hapi/boom'
import _ from 'lodash'

import { NFTMetaData } from 'entity/NFTMetadata'

const router = express.Router()

router.get('/:collectionId/:tokenId', async (req, res, next) => {
  const { collectionId, tokenId } = req.params
  try {
    const nftMetadata = await NFTMetaData.createQueryBuilder('nft')
      .where('nft.id = :tokenId ', { tokenId })
      .andWhere('nft.collectionId = :collectionId', { collectionId })
      .leftJoinAndSelect('nft.collection', 'symbol')
      .getOne()

    if (!nftMetadata) {
      next(Boom.notFound())
      return
    }

    const { creators, files, collection, ...cleanNftMetadata } = nftMetadata
    res.send({
      ...cleanNftMetadata,
      symbol: collection.symbol,
      properties: { creators, files },
      collection: { name: collection.name, family: collection.family },
    })
  } catch (e) {
    next(e)
  }
})

export default router
