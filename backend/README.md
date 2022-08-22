# @solrace/backend


create `.env` and set the environment variables. Follow the `.env.example` for more details


copy generated asset to `assets` folder ( only json file)

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

generate kart metadata
```
yarn create-kart -s <FIRST_TOKEN_ID> -e <LAST_TOKEN_ID> -url <S3_URL>
```

generate garage metadata
```
yarn create-garage -s <FIRST_TOKEN_ID> -e <LAST_TOKEN_ID> -url <S3_URL>
```

start development server
```
yarn dev
```



