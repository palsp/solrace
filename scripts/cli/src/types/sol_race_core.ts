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
      "args": []
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
            "type": "u64"
          },
          {
            "name": "acceleration",
            "type": "u64"
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
            "type": "u64"
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
    },
    {
      "code": 6009,
      "name": "NotMasterEdition",
      "msg": "Not master edition"
    },
    {
      "code": 6010,
      "name": "InvalidCreator",
      "msg": "Invalid Creator"
    },
    {
      "code": 6011,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata"
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
      "args": []
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
            "type": "u64"
          },
          {
            "name": "acceleration",
            "type": "u64"
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
            "type": "u64"
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
    },
    {
      "code": 6009,
      "name": "NotMasterEdition",
      "msg": "Not master edition"
    },
    {
      "code": 6010,
      "name": "InvalidCreator",
      "msg": "Invalid Creator"
    },
    {
      "code": 6011,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata"
    }
  ]
};
