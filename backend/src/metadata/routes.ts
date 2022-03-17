import express from 'express'
import Boom from '@hapi/boom'
import _ from 'lodash'

import { NFTCollection } from 'entity/NFTCollection'

const router = express.Router()

// router.get('/:collectionId/:tokenId', async (req, res, next) => {
//   const { collectionId, tokenId } = req.params
//   try {
//     // const nftMetadata = await NFTMetaData.createQueryBuilder('nft')
//     //   .where('nft.id = :tokenId ', { tokenId })
//     //   .andWhere('nft.collectionId = :collectionId', { collectionId })
//     //   .leftJoinAndSelect('nft.collection', 'symbol')
//     //   .getOne()

//     const token = await NFTAttributes.createQueryBuilder('nft')
//       .where('nft.tokenId = :tokenId', { tokenId })
//       .andWhere('nft.tokenCollection = :collectionId', { collectionId })
//       .leftJoinAndSelect('nft.token', 'token')
//       .getOne()

//     if (!token) {
//       next(Boom.notFound())
//       return
//     }

//     const collection = await NFTCollection.findOne({ id: collectionId })
//     if (!collection) {
//       next(Boom.notFound())
//       return
//     }

//     const {
//       token: { files, creators, ...metadata },
//       ...attributes
//     } = token

//     const parsedAttributes: MetadataAttribute[] = Object.entries(
//       _.omit(attributes, 'id'),
//     ).reduce((prev, cur) => {
//       prev.push({
//         trait_type: cur[0],
//         value: cur[1],
//       })
//       return prev
//     }, [] as MetadataAttribute[])

//     const parsedToken: MetadataResponse = {
//       ...metadata,
//       symbol: collection.symbol,
//       properties: {
//         files,
//         creators,
//       },
//       attributes: parsedAttributes,
//       collection: {
//         name: collection.name,
//         family: collection.family,
//       },
//     }
//     res.send(parsedToken)
//   } catch (e) {
//     console.log(e)
//     next(e)
//   }
// })

export default router
