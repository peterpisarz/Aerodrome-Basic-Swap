const hre = require("hardhat")

const routerAddress = '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43'

async function main() {
  // Compile the contract
  const BasicSwap = await hre.ethers.getContractFactory("BasicSwap");

  // Deploy the contract
  console.log("Deploying BasicSwap...");
  const myContract = await BasicSwap.deploy(routerAddress, { gasLimit: 12000000});
  const tx = await myContract.waitForDeployment();
  console.log(`BasicSwap deployed to: ${await myContract.getAddress()} on ${hre.network.name}\n`);

  // // Verify on Etherscan
  // const WAIT_BLOCK_CONFIRMATIONS = 6;
  // await myContract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  // console.log(`Verifying contract on Etherscan...`);

  // await run(`verify:verify`, {
  //   address: myContract.address,
  //   constructorArguments: [routerAddress],
  // });

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
