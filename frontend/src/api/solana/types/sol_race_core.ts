export type SolRaceCore = {
  "version": "0.1.0",
  "name": "sol_race_core",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolName",
          "type": "string"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "PoolBumps"
          }
        },
        {
          "name": "totalDistribution",
          "type": "u128"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "multiplierUnit",
          "type": "u128"
        },
        {
          "name": "maxMultiplier",
          "type": "u128"
        }
      ]
    },
    {
      "name": "verify",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "garageMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMetadataAccount",
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
          "name": "poolAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initStake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initKart",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "bond",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unBond",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawFromTreasury",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "upgradeKart",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "exchangeForMultiplier",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unit",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "poolAuthority",
            "type": "publicKey"
          },
          {
            "name": "garageCreator",
            "type": "publicKey"
          },
          {
            "name": "kartCreator",
            "type": "publicKey"
          },
          {
            "name": "stakingAuthority",
            "type": "publicKey"
          },
          {
            "name": "solrMint",
            "type": "publicKey"
          },
          {
            "name": "poolSolr",
            "type": "publicKey"
          },
          {
            "name": "bumps",
            "type": {
              "defined": "PoolBumps"
            }
          },
          {
            "name": "totalDistribution",
            "type": "u128"
          },
          {
            "name": "totalStaked",
            "type": "u128"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "lastDistributed",
            "type": "i64"
          },
          {
            "name": "globalRewardIndex",
            "type": "f64"
          },
          {
            "name": "multiplierUnit",
            "type": "u128"
          },
          {
            "name": "maxMultiplier",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "stakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "garageMint",
            "type": "publicKey"
          },
          {
            "name": "garageMetadataAccount",
            "type": "publicKey"
          },
          {
            "name": "garageMasterEdition",
            "type": "publicKey"
          },
          {
            "name": "isBond",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "rewardIndex",
            "type": "f64"
          },
          {
            "name": "pendingReward",
            "type": "u128"
          },
          {
            "name": "multiplier",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "kartAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "kartMint",
            "type": "publicKey"
          },
          {
            "name": "kartMetadataAccount",
            "type": "publicKey"
          },
          {
            "name": "kartMasterEdition",
            "type": "publicKey"
          },
          {
            "name": "maxSpeed",
            "type": "f64"
          },
          {
            "name": "acceleration",
            "type": "f64"
          },
          {
            "name": "driftPowerGenerationRate",
            "type": "f64"
          },
          {
            "name": "driftPowerConsumptionRate",
            "type": "f64"
          },
          {
            "name": "handling",
            "type": "f64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolAccount",
            "type": "u8"
          },
          {
            "name": "poolSolr",
            "type": "u8"
          },
          {
            "name": "solrTreasury",
            "type": "u8"
          }
        ]
      }
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
      "name": "InvalidStakingAuthority",
      "msg": "Invalid StakingAuthority"
    },
    {
      "code": 6003,
      "name": "InvalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6004,
      "name": "InvalidAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6005,
      "name": "EmptyMetadata",
      "msg": "Empty Metadata"
    },
    {
      "code": 6006,
      "name": "NotVerified",
      "msg": "Creator not verified"
    },
    {
      "code": 6007,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6008,
      "name": "AlreadyStake",
      "msg": "Already stake"
    },
    {
      "code": 6009,
      "name": "NotStake",
      "msg": "Not stake"
    },
    {
      "code": 6010,
      "name": "NotMasterEdition",
      "msg": "Not master edition"
    },
    {
      "code": 6011,
      "name": "InvalidCreator",
      "msg": "Invalid Creator"
    },
    {
      "code": 6012,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata"
    },
    {
      "code": 6013,
      "name": "MaxMultiplierReach",
      "msg": "Max Multiplier Reach"
    },
    {
      "code": 6014,
      "name": "InsufficientFund",
      "msg": "Insufficient Fund"
    },
    {
      "code": 6015,
      "name": "BalanceExceed",
      "msg": "Balance Exceed"
    }
  ]
};

export const IDL: SolRaceCore = {
  "version": "0.1.0",
  "name": "sol_race_core",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolName",
          "type": "string"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "PoolBumps"
          }
        },
        {
          "name": "totalDistribution",
          "type": "u128"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "multiplierUnit",
          "type": "u128"
        },
        {
          "name": "maxMultiplier",
          "type": "u128"
        }
      ]
    },
    {
      "name": "verify",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "garageMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMetadataAccount",
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
          "name": "poolAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initStake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "garageMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initKart",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartMetadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatureEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "bond",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unBond",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawFromTreasury",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "upgradeKart",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "kartAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "kartTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "exchangeForMultiplier",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userSolr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "garageTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unit",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "poolAuthority",
            "type": "publicKey"
          },
          {
            "name": "garageCreator",
            "type": "publicKey"
          },
          {
            "name": "kartCreator",
            "type": "publicKey"
          },
          {
            "name": "stakingAuthority",
            "type": "publicKey"
          },
          {
            "name": "solrMint",
            "type": "publicKey"
          },
          {
            "name": "poolSolr",
            "type": "publicKey"
          },
          {
            "name": "bumps",
            "type": {
              "defined": "PoolBumps"
            }
          },
          {
            "name": "totalDistribution",
            "type": "u128"
          },
          {
            "name": "totalStaked",
            "type": "u128"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "lastDistributed",
            "type": "i64"
          },
          {
            "name": "globalRewardIndex",
            "type": "f64"
          },
          {
            "name": "multiplierUnit",
            "type": "u128"
          },
          {
            "name": "maxMultiplier",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "stakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "garageMint",
            "type": "publicKey"
          },
          {
            "name": "garageMetadataAccount",
            "type": "publicKey"
          },
          {
            "name": "garageMasterEdition",
            "type": "publicKey"
          },
          {
            "name": "isBond",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "rewardIndex",
            "type": "f64"
          },
          {
            "name": "pendingReward",
            "type": "u128"
          },
          {
            "name": "multiplier",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "kartAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "kartMint",
            "type": "publicKey"
          },
          {
            "name": "kartMetadataAccount",
            "type": "publicKey"
          },
          {
            "name": "kartMasterEdition",
            "type": "publicKey"
          },
          {
            "name": "maxSpeed",
            "type": "f64"
          },
          {
            "name": "acceleration",
            "type": "f64"
          },
          {
            "name": "driftPowerGenerationRate",
            "type": "f64"
          },
          {
            "name": "driftPowerConsumptionRate",
            "type": "f64"
          },
          {
            "name": "handling",
            "type": "f64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolAccount",
            "type": "u8"
          },
          {
            "name": "poolSolr",
            "type": "u8"
          },
          {
            "name": "solrTreasury",
            "type": "u8"
          }
        ]
      }
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
      "name": "InvalidStakingAuthority",
      "msg": "Invalid StakingAuthority"
    },
    {
      "code": 6003,
      "name": "InvalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6004,
      "name": "InvalidAmount",
      "msg": "Invalid token amount"
    },
    {
      "code": 6005,
      "name": "EmptyMetadata",
      "msg": "Empty Metadata"
    },
    {
      "code": 6006,
      "name": "NotVerified",
      "msg": "Creator not verified"
    },
    {
      "code": 6007,
      "name": "InvalidTime",
      "msg": "Invalid time"
    },
    {
      "code": 6008,
      "name": "AlreadyStake",
      "msg": "Already stake"
    },
    {
      "code": 6009,
      "name": "NotStake",
      "msg": "Not stake"
    },
    {
      "code": 6010,
      "name": "NotMasterEdition",
      "msg": "Not master edition"
    },
    {
      "code": 6011,
      "name": "InvalidCreator",
      "msg": "Invalid Creator"
    },
    {
      "code": 6012,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata"
    },
    {
      "code": 6013,
      "name": "MaxMultiplierReach",
      "msg": "Max Multiplier Reach"
    },
    {
      "code": 6014,
      "name": "InsufficientFund",
      "msg": "Insufficient Fund"
    },
    {
      "code": 6015,
      "name": "BalanceExceed",
      "msg": "Balance Exceed"
    }
  ]
};
