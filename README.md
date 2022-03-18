# SOLRACE 


SolRace is a blockchain racing game on the Solana blockchain inspired by the Mario kart.



## Technology 
- Nodejs
- Nextjs
- Anchor Framework
- unreal engine 4
- AWS
- Postgresql


### Game code and deployed game
the code and game can be downloaded from the google drive link here: https://drive.google.com/drive/folders/16On1ksGkRvLx1HPzvb9onXWU-oL0zL5I?usp=sharing

WindowsNoEditor.rar is a fully deployed game, you can extract and run the game on the application file.

GameFile.rar is an unreal project file that can be opened via Unreal Engine Project File (.uproject)

The project file is built in Unreal Engine 4 version 4.26, containing multiple Unreal Engine Asset Files (.uasset). If you want to fully see all the game component's in detail, please download the engine from the link here: https://www.unrealengine.com/en-US/download



#### Deploy

  if you want use our devnet program, please skip this section.

`
  yarn build
  yarn deploy
`

create pool for your nft 

Set your program id in `cli/.env` file.
```
SOL_RACE_STAKING_PROGRAM_ID=
```

copy the generated types and idl 
```
anchor run copy_types
anchor run copy_types_backend
anchor run copy_types_cli
```

initialize pool. In the cli directory, run
```
  yarn init-pool
```
it will prompt some questions in the cli.


Update the addresses in `backend/src/solana/addresses.to` and `frontend/src/api/solana/addresses`. Theses is what you needed
1. SOLR_MINT_ADDRESS
2. GARAGE_CREATOR
3. GARAGE_CM_ID
4. KART_CREATOR
5. KART_CM_ID
6. SOL_RACE_CORE_PROGRAM_ID



### setup aws resource 
  See the details in `aws/README.md`

### setup metaplex candy machine and nft's assets
  See the details in `scripts/README.md`


### setup and start the backend server
  See the details in `backend/README.md`


### setup and start the frontend
  Set the environment variables. Follow `frontend/.env.example` for more details

  ```
    yarn dev
  ```


## Program Detail 
The program consist of two main features

1. staking nft (garage)
- user can stake our nft aka garage to earn SOLR, our governance token. 

- Garage's staker can use their garage to upgrade racing kart of other racers. 
Garage's staker will also earn upgrading fee no matters the upgrade is success or fail. 


2. upgrade (kart)

- racers can upgrade their nft aka kart to enhance their in games attributes e.g. max speed, acceleration etc. 





