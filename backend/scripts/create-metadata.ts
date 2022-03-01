import { NFTMetaData } from 'entity/NFTMetadata'
import { NFTCollection } from 'entity/NFTCollection'
import { connectDB } from 'database'
import _ from 'lodash'

import path from 'path'
import { DeepPartial } from 'typeorm'
import { NFTAttributes } from 'entity/NFTAttributes'

const collectionPath = path.join(process.cwd(), 'assets', `collection.json`)

const collection = require(collectionPath)
console.log(collection)

async function createMetadata(
  id: number,
  imageBaseURI: string,
  collectionAddress?: string,
) {
  const filePath = path.join(process.cwd(), 'assets', `${id}.json`)
  const nft = require(filePath)

  const { properties } = _.pick(nft, ['properties'])
  const meta = _.omit(
    nft,
    'properties',
    'collection',
    'seller_fee_basis_points',
    'external_url',
    'symbol',
    'image',
    'attributes',
  ) as DeepPartial<NFTMetaData>

  let nftCollection = await NFTCollection.findOne({ name: collection.name })
  if (!nftCollection) {
    nftCollection = await NFTCollection.create({
      name: collection.name,
      family: collection.family,
      symbol: collection.symbol,
      publicAddress: collectionAddress,
    }).save()
  }

  const token = await NFTMetaData.create({
    ...meta,
    id,
    image: `${imageBaseURI}/${nft.image}`,
    sellerFeeBasisPoints: nft.seller_fee_basis_points,
    externalUrl: nft.external_url,
    collection: nftCollection,
    files: properties.files.map((file) => ({
      ...file,
      uri: `${imageBaseURI}/${file.uri}`,
    })),
    creators: properties.creators,
  }).save()

  await NFTAttributes.create({
    token,
    maxSpeed: 50 + Math.floor(Math.random() * 50),
    acceleration: 50 + Math.floor(Math.random() * 50),
    driftPowerGenerationRate: 20 + Math.floor(Math.random() * 20),
    driftPowerConsumptionRate: 10 + Math.floor(Math.random() * 20),
    handling: 50 + Math.floor(Math.random() * 50),
  }).save()
}

async function main() {
  const args = process.argv.slice(2)

  let start = 0
  let end = 0
  let imageBaseURI = ''
  let collectionAddress: string | undefined = undefined
  for (let i = 0; i < args.length; i += 2) {
    const opt = args[i]
    const val = args[i + 1]

    switch (opt) {
      case '-s':
      case '-start':
        start = +val
        break
      case '-e':
      case '-end':
        end = +val
        break
      case '-a':
      case '-address':
        collectionAddress = val
        break
      case '-url':
        imageBaseURI = val
        break
    }
  }

  if (isNaN(start) || isNaN(end) || start < 0 || end < 0) {
    throw new Error('-s and -e must be a positive number')
  }

  if (start >= end) {
    throw new Error('-s must less than -e')
  }

  if (imageBaseURI === '') {
    throw new Error('-url must be set')
  }

  const connection = await connectDB()
  for (let i = start; i <= end; i++) {
    console.log(`process ${i}.json`)
    await createMetadata(i, imageBaseURI, collectionAddress)
  }
  await connection.close()
}

main()
