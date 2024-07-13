// SPDX-License-Identifier: GPL-3.0

// BasicSwap V2

/*
* Variety of functions which interact with Aerodrome's Router contract.
* Many of these functions produce the same end result (a token swap) but with a different swapping philosophy
* Most of these are tests of features and variations in logic before incorporating into more sophisticated bots
* Welcome job recruiters!! This contract is mainly a demo of my skills, please reach out for further questions.
*/

pragma solidity ^0.8.19;

import 'hardhat/console.sol';
import "./Router.sol";
import { TransferHelper } from '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract BasicSwap {
    IRouter public router;
    address public factoryAerodrome = 0x420DD381b31aEf6683db6B902084cB0FFECe40Da;
    address public owner;

    constructor(address _routerAddress) {
        router = IRouter(_routerAddress);
        owner = msg.sender;
    }

    /*
    * 1.)
    * @notice ETH to Tokens of your choice. Straight forward... classic swap
    * @dev Calls the swapExactETHForTokens function on an external router contract.
    * The ETH value to be swapped should be sent along with the transaction. 
    * i.e. { value : amountIn } obviously in Wei
    * The function sets a 1-hour deadline for the swap to be executed.
    * 
    * @param _amountOutMin The minimum amount of tokens expected to receive from the swap.
    * @param _routes An array of routes specifying the path of token swaps.
    * Each route consists of the token to be swapped and the corresponding pair contract.
    * @param _to The address to send the swapped tokens to.
    * 
    * @return amounts An array of output amounts for each token in the swap path.
    */
    function swapETHForTokens(
        uint256 _amountOutMin, 
        IRouter.Route[] calldata _routes, 
        address _to) 
    external payable returns (uint256[] memory amounts) {
        // Call the swapExactETHForTokens function on the external router contract
        router.swapExactETHForTokens{value: msg.value}(
            _amountOutMin, 
            _routes, 
            _to, 
            block.timestamp + 3600
        );

        return amounts;
    }

    /*
    * 2.)
    * @notice Tokens to Tokens. ERC20. The good stuff
    * @dev Calls the swapExactTokensForTokens function on an external router contract.
    * Function sets a 1-hour deadline for the swap to be executed.
    * 
    * @param _amountIn is the amount of tokenA you want to swap for tokenB
    * @param _amountOutMin The minimum amount of tokens expected to receive from the swap.
    * @param _routes An array of routes specifying the path of token swaps.
    * Each route consists of the token to be swapped and the corresponding pair contract.
    * In javascript this is usually an object array if you're interacting via ethers or web3.js
    * @param _to The address to send the swapped tokens to.
    * 
    * @return amounts An array of output amounts for each token in the swap path.
    */
    function swapTokensForTokens(
        uint256 _amountIn,
        uint256 _amountOutMin, 
        IRouter.Route[] calldata _routes, 

        address _to) 
    external returns (uint256[] memory amounts) {

        TransferHelper.safeTransferFrom(_routes[0].from, msg.sender, address(this), _amountIn);

        TransferHelper.safeApprove(_routes[0].from, address(router), _amountIn);

        // Call the swapExactTokensForTokens function on the external router contract
        router.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin, 
            _routes, 
            _to, 
            block.timestamp + 3600
        );

        return amounts;
    }

    /*
    * 3.)
    * @notice Get an array of Route structs by submitting a 2 array path of token addresses
    * @dev Creates an array of Route structs from Aerodrome's IRouter.sol
    * 
    * @param _path is a two unit array of token addresses
    * 
    * @return routes which is a proper array of Route structs you can then use for swapping
    */
    function getRoutes(
        address[] memory _path
    ) external view returns (IRouter.Route[] memory){

        IRouter.Route[] memory routes = new IRouter.Route[](1);
        routes[0] = IRouter.Route({
            from: _path[0],
            to: _path[1],
            stable: false,
            factory: factoryAerodrome
        });

        return routes;
    }

    // 4. Integrated logic for developing the Routes from an array of token addresses. Then performing the swap
    /*
    * 4.)
    * @notice Integrated logic for developing the Routes from an array of token addresses. Then performing the swap
    * @dev Calls the swapExactTokensForTokens function on an external router contract.
    * Function sets a 20-minute deadline for the swap to be executed.
    * 
    * @param _path is a two unit array of token addresses
    * @param _amountIn is the amount of tokenA you want to swap for tokenB
    * @param _amountOut The minimum amount of tokens expected to receive from the swap.
    * 
    * !!! IMPORTANT !!!
    * @return amounts An array of output amounts to THIS CONTRACT. This is for local testing only
    */
    function execute(
        address[] memory _path,
        uint256 _amountIn,
        uint256 _amountOut
    ) external {
        TransferHelper.safeTransferFrom(_path[0], msg.sender, address(this), _amountIn);
        TransferHelper.safeApprove(_path[0], address(router), _amountIn);

        IRouter.Route[] memory routes = new IRouter.Route[](1);
        routes[0] = IRouter.Route({
            from: _path[0],
            to: _path[1],
            stable: false,
            factory: factoryAerodrome
        });


        // Call the swapExactTokensForTokens function on the external router contract
        router.swapExactTokensForTokens(
            _amountIn,
            _amountOut, 
            routes,
            address(this), 
            block.timestamp + 1200
        );
    }
 
    /*
    * 5a.)
    * @notice Internal function for getting Route struct from path. Internal/External call pattern
    * @dev Calls the swapExactTokensForTokens function on an external router contract.
    * Function sets a 20-minute deadline for the swap to be executed.
    * 
    * @param _path is a two unit array of token addresses
    * 
    * @return routes struct to be used in swap for external contract call
    */
    function _getRoutes(
        address[] memory _path
    ) internal view returns (IRouter.Route[] memory){

        IRouter.Route[] memory routes = new IRouter.Route[](1);
        routes[0] = IRouter.Route({
            from: _path[0],
            to: _path[1],
            stable: false,
            factory: 0x420DD381b31aEf6683db6B902084cB0FFECe40Da
        });

        return routes;
    }

    /*
    * 5b.)
    * @notice External function for performing a swap. Calls the internal function for getRoutes
    * @dev Calls the swapExactTokensForTokens function on an external router contract.
    * Function sets a 20-minute deadline for the swap to be executed.
    * 
    * @param _path is a two unit array of token addresses
    * @param _amountIn is the amount of tokenA you want to swap for tokenB
    * @param _amountOut The minimum amount of tokens expected to receive from the swap.
    * 
    * !!! IMPORTANT !!!
    * @return amounts An array of output amounts to THIS CONTRACT. This is for local testing only
    */
    function executeRoutes(
        address[] memory _path,
        uint256 _amountIn,
        uint256 _amountOut        
    ) external {
        require(_path.length == 2, "Path must have two elements");
        TransferHelper.safeTransferFrom(_path[0], msg.sender, address(this), _amountIn);
        TransferHelper.safeApprove(_path[0], address(router), _amountIn);
    
        IRouter.Route[] memory _routes = _getRoutes(_path);

        // Call the swapExactTokensForTokens function on the external router contract
        router.swapExactTokensForTokens(
            _amountIn,
            _amountOut,
            _routes,
            address(this), 
            block.timestamp + 1200
        );
    }

    /*
    * 5b.)
    * @notice Simple withdrawl pattern for tokens which may be sent to the contract
    * @dev Owner calls the withdraw function on an external router contract.
    * 
    * @param _token is the address of the token you want to extract from the contract
    * 
    * Not the best logical method for reciving tokens during a swap, but writing the contract
    * in this manner to demonstrate functionality and how an action like this may be done.
    */
    function withdraw(address _token) external {
        require(msg.sender == owner, "Owner must call this function. Funds returned to owner only");
        IERC20(_token).transfer(owner, IERC20(_token).balanceOf(address(this)));
    }
}
 