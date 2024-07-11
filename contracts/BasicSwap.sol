// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'hardhat/console.sol';
import "./Router.sol";
import { TransferHelper } from '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract BasicSwap {
    IRouter public router;
    address public factoryAerodrome = 0x420DD381b31aEf6683db6B902084cB0FFECe40Da;

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

        return amounts;
    }

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

    function executeDirect(
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
    }
    
}
 