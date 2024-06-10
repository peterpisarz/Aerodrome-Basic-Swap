// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Router.sol";
import { TransferHelper } from '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "hardhat/console.sol";

contract BasicSwap {
    IRouter public router;

    constructor(address _routerAddress) {
        router = IRouter(_routerAddress);
    }

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
    }

    function swapTokensForTokens(
        uint256 _amountIn,
        uint256 _amountOutMin, 
        IRouter.Route[] calldata _routes, 
        address _to) 
    external returns (uint256[] memory amounts) {
        console.log("Testing 1,2,3...");
        console.log("_routes[0].from: ", _routes[0].from);
        console.log("_amountIn: ", _amountIn);

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
    }

    // Smoke test function to ensure the contract can read the imported Router.sol
    function getFactoryRegistry() public view returns (address) {
        return router.factoryRegistry();
    }
}
