# Basic Swap on Aerodrome

This is a project that I created to test some basic functionality and interactions with the Aerodrome DEX on Base L2 Network

I created this contract entirely on my own as an entry point to interacting with Aerodrome. At the time of writing this, there is no dev documentation on Aerodrome, so this was a product of my own digging through Github, finding the correct functions and contracts to use.

The contract calls the swapExactETHForTokens function on the Aerdrome Router.sol contract (0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43)

The hope is to work this logic into more complex contracts for DeFi purposes.

A simplified version of this contract was deployed to the Base network at:

0x08d636ABAFec0f0b08Fe4d8dCFf43F933Cc03975
https://basescan.org/address/0x08d636ABAFec0f0b08Fe4d8dCFf43F933Cc03975

## Setting up the Project

You can clone this project into a local directory.

Install the node packages
`npm install`

in the .env file, Enter your:
- Private Key
- Alchemy API Key
- Etherscan API Key (If you would like to verify the contract on Etherscan)

## Running on Localhost

Start a hardhat node with
`npx hardhat node`

Deploy the contract with
`npx hardhat run scripts/deploy.js --network localhost`

Copy and paste the contract address into the swap.js variable called
`basicSwapAddress`

Set `isLive` to `false`

Call the swap with
`npx hardhat run scripts/swap.js --network localhost` 

## Running on Base Mainnet

Deploy the contract with
`npx hardhat run scripts/deploy.js --network base`

Copy and paste the contract address into the swap.js variable called
`basicSwapAddress`

Set `isLive` to `true`

Call the swap with
`npx hardhat run scripts/swap.js --network base`

### Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
