const hre = require("hardhat")

const routerAddress = '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43'

async function main() {
  // Compile the contract
  const BasicSwap = await hre.ethers.getContractFactory("BasicSwap");

  // Deploy the contract
  console.log("Deploying BasicSwap...");
  const myContract = await BasicSwap.deploy(routerAddress);
  const tx = await myContract.waitForDeployment();
  console.log(`BasicSwap deployed to: ${await myContract.getAddress()} on ${hre.network.name}\n`);

  console.log(tx)

  // Perform the swap
  // console.log("Swapping ETH for tokens...");
  // const amountOutMin = ethers.utils.parseEther("0.001"); // Minimum amount of tokens expected
  // const routes = []; // Array of trade routes used in the swap
  // const to = "YOUR_TOKEN_RECIPIENT_ADDRESS"; // Recipient of the tokens received
  // const deadline = Math.floor(Date.now() / 1000) + 3600; // Deadline to receive tokens (1 hour from now)
  // const tx = await myContract.swapETHForTokens(amountOutMin, routes, to, deadline, { value: ethers.utils.parseEther("0.001") });
  // await tx.wait();
  // console.log("ETH swapped for tokens!");

  // Verify on Etherscan
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
