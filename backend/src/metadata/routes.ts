import express from 'express'
import Boom from '@hapi/boom'
import _ from 'lodash'

import { NFTMetaData } from 'entity/NFTMetadata'

const router = express.Router()

router.get('/:collectionId/:tokenId', async (req, res, next) => {
  const { collectionId, tokenId } = req.params
  const nftMetadata = await NFTMetaData.createQueryBuilder('nft')
    .where('nft.id = :tokenId ', { tokenId })
    .andWhere('nft.collectionId = :collectionId', { collectionId })
    .getOne()

  if (!nftMetadata) {
    next(Boom.notFound())
    return
  }

  const { creators, files } = nftMetadata
  const cleanNftMetadata = _.omit(nftMetadata, 'creators', 'files')
  res.send({ ...cleanNftMetadata, properties: { creators, files } })
})

export default router
