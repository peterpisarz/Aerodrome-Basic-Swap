const hre = require("hardhat")
require("dotenv").config()
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const isLive = false
let provider

// CONFIGURATION VARIABLES
const basicSwapAddress = "0x38a024C0b412B9d1db8BC398140D00F5Af3093D4" // Contract address of BasicSwap
const aeroAddress = '0x940181a94A35A4569E4529A3CDfB74e38FD98631' // Address of token you want to receive
const tokenAddress = '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' // DAI address in this case
const amountIn = hre.ethers.parseUnits("0.001", 18)  // Amount of ETH to swap

const main = async () => {

	// Initiate provider and get signer
	if (isLive) {
		console.log("Running on Mainnet...\n")
		provider = new hre.ethers.WebSocketProvider(`wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`)
	} else {
		console.log("Running on Localhost...\n")
		provider = new hre.ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)
	}

	const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
	console.log("Signer: ", signer.address)

	// Get ABI and Contract Instance
	const IBasicSwap = require('../artifacts/contracts/BasicSwap.sol/BasicSwap.json')
	const basicSwap = new hre.ethers.Contract(basicSwapAddress, IBasicSwap.abi, provider)

	// Get AERO and DAI Contracts
	const aeroContract = new hre.ethers.Contract(aeroAddress, IERC20.abi, provider)
	const daiContract = new hre.ethers.Contract(tokenAddress, IERC20.abi, provider)

	// Get AERO Balance Before
	let balance = await aeroContract.balanceOf(signer.address)
	console.log(`\nBalance of AERO Before: ${ethers.formatUnits(balance, 18)}\n`)
	const path = [aeroAddress, tokenAddress]

	// Perform the swap
	console.log("Swapping ETH for AERO...\n");
	const amountOutMin = BigInt(0); // Minimum amount of tokens expected

	console.log(`Path: ${path}`)

	const tx = await basicSwap.connect(signer).getRoutes(path);

	console.log("Routes: ")
	console.log(tx)

	console.log("\nFirst Swap. ETH to AERO...\n")

  const routes = [{
    from: '0x4200000000000000000000000000000000000006', // WETH Address on Base
    to: aeroAddress,
    stable: false,
    factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da' // Aerodrome Factory Address
  }];

	// Create an object with the data and log it as a table
	let data = {
	    amountOutMin: { value: amountOutMin, type: typeof amountOutMin },
	    routes: { value: routes.join(", "), type: typeof routes },
	    to: { value: signer.address, type: typeof signer.address },
	    amountIn: { value: amountIn, type: typeof amountIn }
	};
	console.table(data);

	let currentNonce = await provider.getTransactionCount(signer.address);
	console.log(`\n1st Nonce: ${currentNonce}`)

	const tx2 = await basicSwap.connect(signer).swapETHForTokens(
		amountOutMin,
		routes,
		signer.address,
		{ value: amountIn }
	);

	console.log("Delay 2000...\n")
	await delay(2000)

	// Get AERO Balance After
	balance = await aeroContract.balanceOf(signer.address)
	console.log(`Balance of AERO After: ${ethers.formatUnits(balance, 18)}\n`)
	const amountInAERO = balance

	console.log(`tx3 amountInAERO ${balance}`)
	console.log(`tx3 amountOutMin ${amountOutMin}\n`)

	// Approve AERO to be spent by the swap contract
	const tx3 = await aeroContract.connect(signer).approve(basicSwapAddress, amountInAERO)

	console.log("Delay 2000...\n")
	await delay(2000)

	const routes2 = [{
    from: aeroAddress,
    to: tokenAddress, // DAI in this example
    stable: false,
    factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da' // Aerodrome Factory Address
  }];

	const tx4 = await basicSwap.connect(signer).executeDirect(
  	amountInAERO,
  	amountOutMin,
  	routes2,
  	signer.address
	)

	balance = await daiContract.balanceOf(signer.address)
	console.log(`Balance of DAI After: ${ethers.formatUnits(balance, 18)}\n`)
	console.log("\n*** Swap Complete! ***")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});