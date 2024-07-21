const hre = require("hardhat")

const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"
const contractAddress = "0xf75d8487611972fC1f84F2Fb3675017EaB6155AE"

async function main() {

  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId;

  if (chainId != 31337) {
    // Verify the contract on Etherscan
    console.log(`Verifying contract on ${hre.network.name}...`);

    try {
      await run(`verify:verify`, {
        address: contractAddress,
        constructorArguments: [routerAddress],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  } else {
    console.log(`Cannot verify on localhost`)
  }
  console.log(`Deployment Script Complete!`)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
