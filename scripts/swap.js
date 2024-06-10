const hre = require("hardhat")
require("dotenv").config()

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const isLive = false
let provider

// CONFIGURATION VARIABLES
const basicSwapAddress = "0x3aAde2dCD2Df6a8cAc689EE797591b2913658659" // Contract address of BasicSwap
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

	// Get AERO Contract
	const aeroContract = new ethers.Contract(aeroAddress, IERC20.abi, provider)
	const daiContract = new ethers.Contract(tokenAddress, IERC20.abi, provider)

	// Smoke Test to ensure connectition and readability
	const router = await basicSwap.router()
	console.log(`Router Address: ${router}\n`)

	// Get AERO Balance Before
	let balance = await aeroContract.balanceOf(signer.address)
	console.log(`Balance of AERO Before: ${ethers.formatUnits(balance, 18)}\n`)

	// Perform the swap
	console.log("Swapping ETH for AERO...\n");
	const amountOutMin = BigInt(0); // Minimum amount of tokens expected
  const routes = [{
    from: '0x4200000000000000000000000000000000000006', // WETH Address on Base
    to: aeroAddress,
    stable: false,
    factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da' // Aerodrome Factory Address
  }];

	// Create an object with the data
	const data = {
	    amountOutMin: { value: amountOutMin, type: typeof amountOutMin },
	    routes: { value: routes.join(", "), type: typeof routes },
	    to: { value: signer.address, type: typeof signer.address },
	    amountIn: { value: amountIn, type: typeof amountIn }
	};

	// Log the data as a table
	console.table(data);

	const tx = await basicSwap.connect(signer).swapETHForTokens(
		amountOutMin, 
		routes, 
		signer.address, 
		{ value: amountIn, 
			gasPrice: ethers.parseUnits('10', 'gwei') }
	);
	console.log("\nETH swapped for tokens!\n");

	// Get AERO Balance After
	balance = await aeroContract.balanceOf(signer.address)
	console.log(`Balance of AERO After: ${ethers.formatUnits(balance, 18)}`)

	let currentNonce = await provider.getTransactionCount(signer.address);
	console.log(`\nCurrent Nonce: ${currentNonce}\n`)

	// BEGIN LOGIC TO SWAP AERO FOR DAI
	console.log("Swapping AERO for DAI...")

	const amountInAERO = balance
	console.log("Pre Approved")
	await aeroContract.connect(signer).approve(basicSwapAddress, amountInAERO)
	console.log("Approved")
  // Define routes for AERO to DAI swap
  const routes2 = [{
    from: aeroAddress,
    to: tokenAddress, // DAI in this example
    stable: false,
    factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da' // Aerodrome Factory Address
  }];

  const data2 = {
	    amountOutMin: { value: amountOutMin, type: typeof amountOutMin },
	    routes2: { value: routes2.join(", "), type: typeof routes },
	    to: { value: signer.address, type: typeof signer.address },
  		amountInAERO: { value: amountInAERO, type: typeof amountInAERO }
	};

	console.table(data2)
  
  try {
	  const tx_tokens = await basicSwap.connect(signer).swapTokensForTokens(
	  	amountInAERO,
	  	amountOutMin,
	  	routes2,
	  	signer.address
	  );
	} catch (error) {
	 	console.log(`Error during swap: ${error}\n`)
	}

	balance = await daiContract.balanceOf(signer.address)
	console.log(`Balance of DAI After: ${ethers.formatUnits(balance, 18)}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
