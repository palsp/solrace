# @solana-hack-nft/backend


set env 
```
DB_NAME=solana_hack_nft_dev
JWT_SECRET=asdf
JWT_EXPIRES_IN=1d
```

copy generated asset to `assets` folder ( image and json file)

create `collection.json` in `assets` folder. look like this
```json
{
  "name" : "KART",
  "symbol": "CK"
}
```

start postgres db and migrate
```
docker compose up -d
yarn db:migration:run
```

generate metadata 
```
yarn create-metadata -s <FIRST_TOKEN_ID> -e <LAST_TOKEN_ID>
```

start development server
```
yarn dev
```



