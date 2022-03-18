import { PublicKey } from '@solana/web3.js'
import { NFTCollection } from 'entity/NFTCollection'
import { getMetadata, getParsedNFTAccountByOwner } from 'nft/services'
import { connection, solraceProgram } from 'solana'
import { KART_CM_ID } from 'solana/addresses'
import { programs } from '@metaplex/js'
import { POOL_NAME } from 'solana/constants'
import { BN } from '@project-serum/anchor'
import { Kart } from 'entity/Kart'
import _ from 'lodash'
import { badRequest, notFound } from '@hapi/boom/lib'
import { NFTMetaData } from 'entity/NFTMetadata'

const {
  metadata: { MetadataData },
} = programs

interface RawKartsByMint {
  [mint: string]: any
}

interface UpgradedKart {
  maxSpeed: BN
  acceleration: BN
  driftPowerGenerationRate: number
  driftPowerConsumptionRate: number
  handling: BN
}

const getRawKartMetadataOfOwnerByMint = async (
  owner: string,
): Promise<RawKartsByMint> => {
  const ownerPubkey = new PublicKey(owner)

  const collection = await NFTCollection.findOne({
    candyMachineId: KART_CM_ID.toBase58(),
  })

  if (!collection) {
    return {}
  }

  const karts: RawKartsByMint = {}

  const nftAccounts = await getParsedNFTAccountByOwner(ownerPubkey)
  for (const { mint } of nftAccounts) {
    const metadataPubkey = await getMetadata(mint)

    const rawMetadata = await connection.getAccountInfo(metadataPubkey)
    if (!rawMetadata) continue

    const metadata = MetadataData.deserialize(rawMetadata.data)

    if (collection.expectedCreatorAddress) {
      // check by expected creator
      const hasCreator = metadata.data.creators.find(
        (creator) =>
          creator.address.toLowerCase() ===
          collection.expectedCreatorAddress?.toLowerCase(),
      )

      if (!hasCreator) continue

      karts[mint.toBase58()] = metadata
    }
  }

  return karts
}

const getUpgradedKart = async (mint: string) => {
  try {
    const [kartAccount] = await PublicKey.findProgramAddress(
      [
        Buffer.from('kart_account'),
        Buffer.from(POOL_NAME),
        new PublicKey(mint).toBuffer(),
      ],
      solraceProgram.programId,
    )

    const upgradedKart = await solraceProgram.account.kartAccount.fetch(
      kartAccount,
    )
    return upgradedKart
  } catch (e) {
    return undefined
  }
}

const getKartsIn = async (names: string[]) => {
  return Kart.createQueryBuilder('kart')
    .leftJoinAndSelect('kart.token', 'token')
    .where('"token"."name" IN (:...names)', { names })
    .getMany()
}

const combineKart = (kart: Kart, upgradedKart: UpgradedKart) => {
  const temp = _.cloneDeep(kart)
  temp.maxSpeed += upgradedKart.maxSpeed.toNumber()
  temp.acceleration += upgradedKart.acceleration.toNumber()
  temp.driftPowerGenerationRate += upgradedKart.driftPowerGenerationRate

  temp.driftPowerConsumptionRate -= upgradedKart.driftPowerConsumptionRate
  if (temp.driftPowerConsumptionRate < 0.2) {
    temp.driftPowerConsumptionRate = 0.2
  }
  temp.handling += upgradedKart.handling.toNumber()

  return temp
}

export const getKartByTokenId = async (
  tokenId: string,
): Promise<MetadataResponse> => {
  let kart = await Kart.createQueryBuilder('kart')
    .leftJoinAndSelect('kart.token', 'token')
    .where('"token"."id" = :tokenId', { tokenId })
    .getOne()

  if (!kart) throw notFound()

  const metadata = await NFTMetaData.createQueryBuilder('metadata')
    .leftJoinAndSelect('metadata.collection', 'collection')
    .where('metadata.name = :name', { name: kart.token.name })
    .getOne()

  if (!metadata) throw badRequest()

  const { mintTokenAccount: mint } = kart
  if (mint) {
    const upgradedKart = await getUpgradedKart(mint)
    if (upgradedKart) {
      kart = combineKart(kart, upgradedKart)
    }
  }

  const {
    collection: { name, family, symbol },
  } = metadata

  return {
    ...kart.json(),
    symbol,
    collection: {
      name,
      family,
    },
  }
}

export const updateKartOwner = async (
  karts: Kart[],
  rawKartsByMints: RawKartsByMint,
  owner: string,
) => {
  const kartMintByTokenId = _.entries(rawKartsByMints).reduce((prev, curr) => {
    const tokenId = curr[1].data.name.split('#')[1]

    if (tokenId) {
      prev[tokenId] = curr[0]
    }
    return prev
  }, {})

  for (const kart of karts) {
    const mint = kartMintByTokenId[kart.token.id]
    if (mint) {
      kart.mintTokenAccount = mint
    }
    kart.owner = owner

    // await kart.save()
  }
}

export const getKartOfOwner = async (
  publicAddress: string,
): Promise<MetadataResponse[]> => {
  const rawKartsMetadataByMint = await getRawKartMetadataOfOwnerByMint(
    publicAddress,
  )

  const kartNames = _.values(rawKartsMetadataByMint).map(
    (kart) => kart.data.name,
  )

  if (kartNames.length === 0) return []

  const karts = await getKartsIn(kartNames)

  const kartByName: { [key: string]: Kart } = {}
  karts.forEach((kart) => {
    _.assign(kartByName, { ...kartByName, [kart.token.name]: kart })
  })

  const results: MetadataResponse[] = []
  for (const mint in rawKartsMetadataByMint) {
    const rawKart = rawKartsMetadataByMint[mint]
    let kart = kartByName[rawKart.data.name]
    const upgradedKart = await getUpgradedKart(mint)

    if (upgradedKart) kart = combineKart(kart, upgradedKart)
    results.push(kart.json())
  }

  return results
}
