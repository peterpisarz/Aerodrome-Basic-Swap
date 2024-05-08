const hre = require("hardhat")
require("dotenv").config()

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

// Initiate provider
// let provider = new hre.ethers.WebSocketProvider(`wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`)
let provider = new hre.ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)

// Basic Swap deployment Address
const basicSwapAddress = "0x172076E0166D1F9Cc711C77Adf8488051744980C"

// Get ABI
const IBasicSwap = require('../artifacts/contracts/BasicSwap.sol/BasicSwap.json')

// Get Contract Instance
const basicSwap = new hre.ethers.Contract(basicSwapAddress, IBasicSwap.abi, provider)

// Get AERO Contract
const aeroContract = new ethers.Contract('0x940181a94A35A4569E4529A3CDfB74e38FD98631', IERC20.abi, provider)

const main = async () => {

	// Smoke Test to ensure connectition and readability
	const router = await basicSwap.router()
	console.log(`Router Address: ${router}\n`)

	// Get AERO Balance Before
	let balance = await aeroContract.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
	console.log(`Balance Before: ${ethers.formatUnits(balance, 18)}\n`)

	// Perform the swap
	console.log("Swapping ETH for tokens...\n");
	const amountOutMin = BigInt(0); // Minimum amount of tokens expected
  const routes = [{
      from: '0x4200000000000000000000000000000000000006',
      to: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
      stable: false,
      factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da'
  }];
	const to = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Recipient of the tokens received
	const amountIn = hre.ethers.parseUnits("0.001", 18)

	console.log(`amountOutMin: \t${amountOutMin} \t\t\t\t\t\t${typeof amountOutMin}`)
	console.log(`routes: \t${routes} \t${typeof routes}`)
	console.log(`to: \t\t${to} \t${typeof to}`)
	console.log(`amountIn: \t${amountIn} \t\t\t\t${typeof amountIn}\n`)

	// // Smoke test function to determine if the Router contract is connected
	// const result = await basicSwap.getFactoryRegistry()
	// console.log(`Factory Registry Address: ${result}`)

	// Get Signer
	const signer = await hre.ethers.getSigner(to)
	console.log("Signer: ", signer.address)

	const tx = await basicSwap.connect(signer).swapETHForTokens(amountOutMin, routes, to, { value: amountIn });
	await tx.wait();
	console.log("ETH swapped for tokens!");
	// console.log(tx)

	// Get AERO Balance After
	balance = await aeroContract.balanceOf(to)
	console.log(`Balance of Aero: ${ethers.formatUnits(balance, 18)}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
