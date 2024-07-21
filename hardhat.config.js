require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const privateKey = process.env.PRIVATE_KEY || ""

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      // gas: 300_000_000, // Default gas limit for transactions
      // blockGasLimit: 300_000_000, // Default block gas limit
      // gasPrice: 200000000000,
      forking: {
        url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`,
        accounts: [process.env.PRIVATE_KEY]
      }
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`,
      accounts: [privateKey],
    }
  },
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY
  },
};
 