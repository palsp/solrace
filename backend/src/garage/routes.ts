import express from 'express'
import _ from 'lodash'
import { notFound } from '@hapi/boom'
import { Kart } from 'entity/Kart'
import { NFTMetaData } from 'entity/NFTMetadata'
import { Garage } from 'entity/Garage'

const router = express.Router()

router.get('/:tokenId', async (req, res, next) => {
  try {
    const nftMetadata = await Garage.createQueryBuilder('garage')
      .leftJoinAndSelect('garage.token', 'token')
      .where('"token"."id" = :tokenId', {
        tokenId: req.params.tokenId,
      })
      .getOne()

    if (!nftMetadata) {
      next(notFound())
      return
    }

    const token = await NFTMetaData.createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.collection', 'collection')
      .where('metadata.name = :name', { name: nftMetadata.token.name })
      .getOne()

    if (!token) {
      next(notFound())
      return
    }

    const { token: __, ...attributes } = nftMetadata
    const { files, creators, collection, ...metadata } = token
    const parsedAttributes: MetadataAttribute[] = Object.entries(
      _.omit(attributes, [
        'id',
        'staker',
        'mintTokenAccount',
        'garage_token_account',
      ]),
    ).reduce((prev, curr) => {
      prev.push({
        trait_type: curr[0],
        value: curr[1],
      })
      return prev
    }, [] as MetadataAttribute[])

    const result: MetadataResponse = {
      ...metadata,
      symbol: token.collection.symbol,
      attributes: parsedAttributes,
      properties: {
        files,
        creators,
      },
      collection: {
        name: collection.name,
        family: collection.family,
      },
    }

    res.send(result)
  } catch (e) {
    console.log(e)
    next(e)
  }
})

export default router
