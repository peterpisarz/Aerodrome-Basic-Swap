const hre = require("hardhat")
require("dotenv").config()
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const isLive = false
let provider

// CONFIGURATION VARIABLES
const basicSwapAddress = "0x525C7063E7C20997BaaE9bDa922159152D0e8417" // Contract address of BasicSwap
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
	await delay(1000)
	const path = [aeroAddress, tokenAddress]

	// Perform the swap
	console.log("Swapping ETH for AERO...\n");
	const amountOutMin = BigInt(0); // Minimum amount of tokens expected

	console.log(path)
	console.log(typeof(amountIn))
	console.log(typeof(amountOutMin))

	const tx = await basicSwap.connect(signer).getRoutes(
		path
	);

	console.log("Routes: ")
	console.log(tx)
	

	const tx2 = await basicSwap.connect(signer).executeRoutes(
		path,
		amountIn,
		amountOutMin,
		{ gasLimit: 20000000 }
	)

	// Get AERO Balance After
	balance = await aeroContract.balanceOf(signer.address)
	console.log(`Balance of AERO After: ${ethers.formatUnits(balance, 18)}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});