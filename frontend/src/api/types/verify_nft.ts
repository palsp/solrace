export type VerifyNft = {
  "version": "0.1.0",
  "name": "verify_nft",
  "instructions": [
    {
      "name": "verifyNft",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotInitialize",
      "msg": "Not Initialize"
    },
    {
      "code": 6001,
      "name": "InvalidOwner",
      "msg": "Invalid owner"
    },
    {
      "code": 6002,
      "name": "InvalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6004,
      "name": "EmptyMetadata",
      "msg": "Empty Metadata"
    },
    {
      "code": 6005,
      "name": "NotVerified",
      "msg": "Creator not verified"
    },
    {
      "code": 6006,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6007,
      "name": "AlreadyStake",
      "msg": "Already stake"
    },
    {
      "code": 6008,
      "name": "NotStake",
      "msg": "Not stake"
    }
  ]
};

export const IDL: VerifyNft = {
  "version": "0.1.0",
  "name": "verify_nft",
  "instructions": [
    {
      "name": "verifyNft",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotInitialize",
      "msg": "Not Initialize"
    },
    {
      "code": 6001,
      "name": "InvalidOwner",
      "msg": "Invalid owner"
    },
    {
      "code": 6002,
      "name": "InvalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6004,
      "name": "EmptyMetadata",
      "msg": "Empty Metadata"
    },
    {
      "code": 6005,
      "name": "NotVerified",
      "msg": "Creator not verified"
    },
    {
      "code": 6006,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6007,
      "name": "AlreadyStake",
      "msg": "Already stake"
    },
    {
      "code": 6008,
      "name": "NotStake",
      "msg": "Not stake"
    }
  ]
};
