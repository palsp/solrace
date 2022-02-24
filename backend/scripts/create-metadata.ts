import { NFTMetaData } from 'entity/NFTMetadata'
import { NFTCollection } from 'entity/NFTCollection'
import { connectDB } from 'database'
import _ from 'lodash'

import fs from 'fs/promises'
import path from 'path'
import { DeepPartial } from 'typeorm'

async function createMetadata(id: number) {
  const filePath = path.join(process.cwd(), 'assets', `${id}.json`)
  const nft = require(filePath)

  const { collection, properties } = _.pick(nft, ['collection', 'properties'])
  const meta = _.omit(
    nft,
    'properties',
    'collection',
    'seller_fee_basis_points',
    'external_url',
  ) as DeepPartial<NFTMetaData>

  let nftCollection = await NFTCollection.findOne({ name: collection.name })
  if (!nftCollection) {
    nftCollection = await NFTCollection.create({
      name: collection.name,
      family: collection.family,
    }).save()
  }

  await NFTMetaData.create({
    ...meta,
    id,
    sellerFeeBasisPoints: nft.seller_fee_basis_points,
    externalUrl: nft.external_url,
    collection: nftCollection,
    files: properties.files,
    creators: properties.creators,
  }).save()
}

async function main() {
  const args = process.argv.slice(2)

  let start = 0
  let end = 0
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
    }
  }

  if (isNaN(start) || isNaN(end) || start < 0 || end < 0) {
    throw new Error('-s and -e must be a positive number')
  }

  if (start >= end) {
    throw new Error('-s must less than -e')
  }

  const connection = await connectDB()
  for (let i = start; i <= end; i++) {
    console.log(`process ${i}.json`)
    await createMetadata(i)
  }
  await connection.close()
}

main()
