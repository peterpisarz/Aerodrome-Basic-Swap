require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const privateKey = process.env.PRIVATE_KEY || ""

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_POLY}`,
        accounts: [process.env.PRIVATE_KEY]
      }
    },
    polygon: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_POLY}`,
      accounts: [privateKey],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
