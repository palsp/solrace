import { notFound } from '@hapi/boom'
import { Garage } from 'entity/Garage'
import { NFTMetaData } from 'entity/NFTMetadata'

export const getGarageByTokenId = async (tokenId: string) => {
  const garage = await Garage.createQueryBuilder('garage')
    .leftJoinAndSelect('garage.token', 'token')
    .where('"token"."id" = :tokenId', { tokenId })
    .getOne()

  if (!garage) throw notFound()

  const metadata = await NFTMetaData.createQueryBuilder('metadata')
    .leftJoinAndSelect('metadata.collection', 'collection')
    .where('metadata.name = :name', { name: garage.token.name })
    .getOne()

  if (!metadata) throw notFound()

  const {
    collection: { name, family, symbol },
  } = metadata

  return {
    ...garage.json(),
    symbol,
    collection: {
      name,
      family,
    },
  }
}
