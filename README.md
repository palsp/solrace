# SOLANA HACKATHON NFT GAME


## Setup

Clone the following repository into `scripts` folder

```
git clone https://github.com/HashLips/hashlips_art_engine.git ./scripts/hashlips_art_engine
git clone https://github.com/metaplex-foundation/metaplex.git ./scripts/metaplex
```


### generate collections and metadata
From root folder. run 

navigate to `scripts/hashlips_art_engine/src/config.js`
```js
// change from
const network = NETWORK.eth;
// to
const network = NETWORK.sol;
```

change the configuration as you like. once ready, run
```
cd scripts/hashlips_art_engine 
yarn install
yarn generate
```

copy the image and metadata file to metaplex folder. 
in the `scripts` folder, run 
```sh
yarn copy
```

### deploy candy machine to devnet

create `config.json` file inside `metaplex` folder. here is a minimal configuration
```json
{
    "price": 1.0,
    "number": 10,
    "gatekeeper": null,
    "solTreasuryAccount": "<YOUR WALLET ADDRESS>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "25 Dec 2021 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "arweave",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```

for more options, visit [metaplex docs](https://docs.metaplex.com/candy-machine-v2/configuration)


create solana keypair 
```sh
solana-keygen new --outfile ~/.config/solana/devnet.json

```
config solana-cli

```sh
solana config set --url devnet
solana config set --keypair ~/.config/solana/devnet.json
```

airdrop some devnet sol
```sh
solana airdrop 1
```

upload and deploy candy machine. in `scripts/metaplex` folder, run
```sh
yarn --cwd js install
ts-node js/packages/cli/src/candy-machine-v2-cli.ts upload \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -cp config.json \
    -c example \
    ./assets
```

verify upload
```
ts-node js/packages/cli/src/candy-machine-v2-cli.ts verify_upload \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -c example
```


### calling the contract
in `scripts/metaplex`

mint one token
```
ts-node js/packages/cli/src/candy-machine-v2-cli.ts mint_one_token \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -c example
```

mint multiple token
```
ts-node js/packages/cli/src/candy-machine-v2-cli.ts mint_multiple_tokens \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -c example \
    --number 2
```