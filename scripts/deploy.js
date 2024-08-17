const hre = require("hardhat")

const routerAddress = '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43'
const slipstreamAddress = '0xBE6D8f0d05cC4be24d5167a3eF062215bE6D18a5'

async function main() {
  // Compile the contract
  const BasicSwap = await hre.ethers.getContractFactory("BasicSwap");

  // Deploy the contract
  console.log("Deploying BasicSwap...");
  const myContract = await BasicSwap.deploy(routerAddress, slipstreamAddress, { gasLimit: 12000000});
  const tx = await myContract.waitForDeployment();
  console.log(`BasicSwap deployed to: ${await myContract.getAddress()} on ${hre.network.name}\n`);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
