const hre = require("hardhat")
require("dotenv").config()

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const isLive = false
let signer, provider

// Basic Swap deployment Address
const basicSwapAddress = "0x08d636ABAFec0f0b08Fe4d8dCFf43F933Cc03975"
const aeroAddress = '0x940181a94A35A4569E4529A3CDfB74e38FD98631'
const wethAddress = '0x4200000000000000000000000000000000000006'
const factoryAddress = '0x420DD381b31aEf6683db6B902084cB0FFECe40Da'
const signerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // <<<<< !IMPORTANT! This is where the tokens will be sent
const amountIn = hre.ethers.parseUnits("0.001", 18)

const main = async () => {

	// Initiate provider and get signer
	if (isLive) {
		console.log("Running on Mainnet...\n")
		provider = new hre.ethers.WebSocketProvider(`wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`)
		signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
	} else {
		console.log("Running on Localhost...\n")
		provider = new hre.ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)
		signer = await hre.ethers.getSigner(signerAddress)
	}
	console.log("Signer: ", signer.address)

	// Get ABI and Contract Instance
	const IBasicSwap = require('../artifacts/contracts/BasicSwap.sol/BasicSwap.json')
	const basicSwap = new hre.ethers.Contract(basicSwapAddress, IBasicSwap.abi, provider)

	// Get AERO Contract
	const aeroContract = new ethers.Contract(aeroAddress, IERC20.abi, provider)


	// Smoke Test to ensure connectition and readability
	const router = await basicSwap.router()
	console.log(`Router Address: ${router}\n`)

	// Get AERO Balance Before
	let balance = await aeroContract.balanceOf(signerAddress)
	console.log(`Balance of AERO Before: ${ethers.formatUnits(balance, 18)}\n`)

	// Perform the swap
	console.log("Swapping ETH for tokens...\n");
	const amountOutMin = BigInt(0); // Minimum amount of tokens expected
  const routes = [{
    from: wethAddress,
    to: aeroAddress,
    stable: false,
    factory: factoryAddress
  }];

	// Create an object with the data
	const data = {
	    amountOutMin: { value: amountOutMin, type: typeof amountOutMin },
	    routes: { value: routes.join(", "), type: typeof routes },
	    to: { value: signerAddress, type: typeof signerAddress },
	    amountIn: { value: amountIn, type: typeof amountIn }
	};

	// Log the data as a table
	console.table(data);

	const tx = await basicSwap.connect(signer).swapETHForTokens(amountOutMin, routes, signerAddress, { value: amountIn });
	await tx.wait();
	console.log("\nETH swapped for tokens!\n");
	// console.log(tx)

	// Get AERO Balance After
	balance = await aeroContract.balanceOf(signerAddress)
	console.log(`Balance of AERO After: ${ethers.formatUnits(balance, 18)}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
