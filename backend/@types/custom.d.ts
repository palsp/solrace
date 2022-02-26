declare namespace Express {
  export interface Request {
    user?: import('entity/User').User
  }
}

interface UserNFTAccount {
  collection: import('entity/NFTCollection').NFTCollection
  accounts: { [key: string]: any }
}
