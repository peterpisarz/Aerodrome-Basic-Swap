// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Router.sol";

contract BasicSwap {
    IRouter public router;

    constructor(address _routerAddress) {
        router = IRouter(_routerAddress);
    }

    function swapETHForTokens(
        uint256 _amountOutMin, 
        IRouter.Route[] calldata _routes, 
        address _to) 
    external payable {
        // Call the swapExactETHForTokens function on the external router contract
        router.swapExactETHForTokens{value: msg.value}(
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
