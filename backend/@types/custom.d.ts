declare namespace Express {
  export interface Request {
    user?: import('entity/User').User
  }
}

interface UserNFTAccount {
  collection: import('entity/NFTCollection').NFTCollection
  accounts: { [key: string]: any }
}

interface MetadataAttribute {
  trait_type: string
  value: any
}

interface MetadataFile {
  uri: string
  type: string
}

interface MetadataResponse {
  id: number
  name: string
  description: string
  sellerFeeBasisPoints?: number
  image: string
  externalUrl?: string
  edition?: number
  attributes: MetadataAttribute[]
  symbol: string
  properties: {
    creators: {
      address: string
      share: number
    }[]
    files: MetadataFile[]
  }
  collection: {
    name: string
    family?: string
  }
}
