// Auto-generated deployment file for Monad Testnet
export const OWNLY_PASSPORT_ADDRESS = "0x3f5Dc421B1D69159e98e93f4f8FDf6427C6BbB31" as const;
export const MONAD_TESTNET_CHAIN_ID = 10143 as const;
export const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz" as const;
export const MONAD_TESTNET_EXPLORER = "https://testnet.monadscan.com" as const;

export const OWNLY_PASSPORT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "brand",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "warrantyExpiry",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fileHash",
        "type": "bytes32"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProductDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "warrantyExpiry",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "notes",
        "type": "string"
      }
    ],
    "name": "ProductUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "serviceCenter",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "receiptHash",
        "type": "bytes32"
      }
    ],
    "name": "ServiceAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "brand",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "purchaseDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "warrantyExpiry",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "storeName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "serialNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "purchasePrice",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsInvoiceCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsImageCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsWarrantyCid",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "fileHash",
            "type": "bytes32"
          }
        ],
        "internalType": "struct OwnlyPassport.AddProductInput",
        "name": "input",
        "type": "tuple"
      }
    ],
    "name": "addProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "serviceCenter",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsReceiptCid",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "receiptHash",
        "type": "bytes32"
      }
    ],
    "name": "addServiceRecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      }
    ],
    "name": "deleteProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      }
    ],
    "name": "getOwnershipHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "fromOwner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "toOwner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct OwnlyPassport.OwnershipHistoryItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "brand",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "purchaseDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "warrantyExpiry",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "storeName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "serialNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "purchasePrice",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsInvoiceCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsImageCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsWarrantyCid",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "fileHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isDeleted",
            "type": "bool"
          }
        ],
        "internalType": "struct OwnlyPassport.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      }
    ],
    "name": "getServiceRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "productId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "date",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "serviceCenter",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsReceiptCid",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "receiptHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct OwnlyPassport.ServiceRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProducts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserProducts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "brand",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "purchaseDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "warrantyExpiry",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "storeName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "serialNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "purchasePrice",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsInvoiceCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsImageCid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsWarrantyCid",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "fileHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isDeleted",
            "type": "bool"
          }
        ],
        "internalType": "struct OwnlyPassport.Product[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "warrantyExpiry",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "notes",
        "type": "string"
      }
    ],
    "name": "updateProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
