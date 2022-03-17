import _ from 'lodash'
import { Wallet } from 'entity/Wallet'
import { passportJwtMiddlewareAuth } from 'auth/middleware'
import express from 'express'
import { getKartOfOwner, getUpgradedKartOfOwner } from 'kart/services'
import { badRequest, notFound } from '@hapi/boom'
import { Kart } from 'entity/Kart'
import { NFTMetaData } from 'entity/NFTMetadata'

const router = express.Router()

router.get('/:tokenId', async (req, res, next) => {
  try {
    const nftMetadata = await Kart.createQueryBuilder('kart')
      .leftJoinAndSelect('kart.token', 'token')
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
    console.log(attributes)
    const parsedAttributes: MetadataAttribute[] = Object.entries(
      _.omit(attributes, ['id', 'owner', 'mintTokenAccount', 'tokenAccount']),
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
router.use(passportJwtMiddlewareAuth())

router.get('/', async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user })
    if (!wallet) {
      next(badRequest('no sync wallet'))
      return
    }

    const kartByTokenAccount = await getKartOfOwner(wallet.publicAddress)

    const kartNames = Object.values(kartByTokenAccount).map(
      (kart) => kart.data.name,
    )

    if (Object.keys(kartByTokenAccount).length === 0) {
      res.send(kartByTokenAccount)
      return
    }

    const [metadatas, upgradedKarts] = await Promise.all([
      await Kart.createQueryBuilder('kart')
        .leftJoinAndSelect('kart.token', 'token')
        .where('"token"."name" IN (:...names)', {
          names: kartNames,
        })
        .getMany(),
      getUpgradedKartOfOwner(wallet.publicAddress),
    ])

    // // console.log(Object.values(karts))

    const upgradedKartByTokenAccount = {}
    upgradedKarts.forEach((upgradedKart) => {
      upgradedKartByTokenAccount[
        upgradedKart.account.kartTokenAccount.toBase58()
      ] = upgradedKart.account
    })

    const metadataByName: { [key: string]: Kart } = {}
    metadatas.forEach((metadata) => {
      metadataByName[metadata.token.name] = metadata
    })

    const results: MetadataResponse[] = []
    for (const tokenAccount in kartByTokenAccount) {
      const rawKart = kartByTokenAccount[tokenAccount]
      const upgradedKart = upgradedKartByTokenAccount[tokenAccount]
      const kartMetadata = metadataByName[rawKart.data.name]

      const { token, ...attributes } = kartMetadata
      const { files, creators, collection, ...metadata } = token

      if (upgradedKart) {
        attributes.maxSpeed += upgradedKart.maxSpeed.toNumber()
        attributes.acceleration += upgradedKart.acceleration.toNumber()
        attributes.driftPowerGenerationRate += upgradedKart.driftPowerGenerationRate.toNumber()
        attributes.driftPowerConsumptionRate += upgradedKart.driftPowerConsumptionRate.toNumber()
        attributes.handling += upgradedKart.handling.toNumber()
      }

      const parsedAttributes: MetadataAttribute[] = Object.entries(
        _.omit(attributes, ['id', 'owner', 'mintTokenAccount', 'tokenAccount']),
      ).reduce((prev, curr) => {
        prev.push({
          trait_type: curr[0],
          value: curr[1],
        })
        return prev
      }, [] as MetadataAttribute[])

      results.push({
        ...metadata,
        attributes: parsedAttributes,
        properties: {
          files,
          creators,
        },
      })
    }

    res.send({ results })
  } catch (e) {
    console.log(e)
    next(e)
  }
})

export default router
