export const IDL = {
  "address": "5AhkXaS77PEWP8pDdQx3SMDbEizqJFns6an8J42dXUuw",
  "metadata": {
    "name": "my_project",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "deposit",
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "ad",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "account",
                "path": "ad.ad_id",
                "account": "Ad"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "account",
                "path": "ad.ad_id",
                "account": "Ad"
              }
            ]
          }
        },
        {
          "name": "advertiser",
          "writable": true,
          "signer": true
        },
        {
          "name": "service_fee",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
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
      "name": "initialise_ad",
      "discriminator": [
        202,
        244,
        112,
        57,
        143,
        226,
        234,
        75
      ],
      "accounts": [
        {
          "name": "ad",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "arg",
                "path": "ad_id"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "arg",
                "path": "ad_id"
              }
            ]
          }
        },
        {
          "name": "advertiser",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ad_id",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Ad",
      "discriminator": [
        81,
        91,
        73,
        106,
        215,
        137,
        214,
        47
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized."
    },
    {
      "code": 6001,
      "name": "InsufficientVault",
      "msg": "Insufficient vault balance."
    },
    {
      "code": 6002,
      "name": "AdInactive",
      "msg": "Ad is not active."
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid amount."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow in calculation."
    },
    {
      "code": 6005,
      "name": "InvalidFeeRecipient",
      "msg": "Invalid fee recipient."
    }
  ],
  "types": [
    {
      "name": "Ad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ad_id",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "is_active",
            "type": "bool"
          }
        ]
      }
    }
  ]
}

export const PROGRAM_ID = "5AhkXaS77PEWP8pDdQx3SMDbEizqJFns6an8J42dXUuw";