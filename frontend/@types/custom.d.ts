type ENDPOINT_NAME =
  | "mainnet-beta"
  | "testnet"
  | "devnet"
  | "localnet"
  | "lending";

interface ENDPOINT {
  name: ENDPOINT_NAME;
  label: string;
  url: string;
  chainId: number;
}

interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface CandyMachineState {
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  isPresale: boolean;
  isWhitelistOnly: boolean;
  goLiveDate: anchor.BN;
  price: anchor.BN;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | {
    number: anchor.BN;
    endSettingType: any;
  };
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
}

interface Collection {
  id: string;
  name: string;
  publicAddress?: string;
  symbol: string;
}

interface MetadataResponse {
  id: number;
  name: string;
  description: string;
  sellerFeeBasisPoints?: number;
  image: string;
  externalUrl?: string;
  edition?: number;
  attributes: MetadataAttribute[];
  symbol?: string;
  properties: {
    creators: {
      address: string;
      share: number;
    }[];
    files: MetadataFile[];
  };
  collection?: {
    name: string;
    family?: string;
  };
}
