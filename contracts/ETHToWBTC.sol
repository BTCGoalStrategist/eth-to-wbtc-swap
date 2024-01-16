// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.20;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

interface IWETH is IERC20 {

  function deposit() external payable;

  function withdraw(uint256 wad) external;
}

contract ETHToWBTC {
    ISwapRouter public immutable swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WBTC = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint24 public constant feeTier = 3000;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapETHforWBTC() external payable {
        uint256 ETHAmount = msg.value;

        //create WETH from ETH
        if (msg.value != 0) {
            IWETH(WETH).deposit{ value: ETHAmount }();
        }
        require(
            IWETH(WETH).balanceOf(address(this)) >= ETHAmount,
            "Ethereum not deposited"
        );

        swapWETHForWBTC(ETHAmount);
        // transfer will do, you don't need to use transferFrom, use it only when the tokens you want to transfer arent held by the contract (like in unwrapEther())  
        //IWETH(WETH).transfer(msg.sender, IWETH(WETH).balanceOf(address(this)));


    }


    function swapWETHForWBTC(uint256 amountIn) internal returns (uint256 amountOut) {
        //TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), ethers);
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);
        uint256 minOut = 0; /* Calculate min output */
        uint160 priceLimit = 0; /* Calculate price limit */
        // // Create the params that will be used to execute the swap
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: WBTC,
                fee: feeTier,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: priceLimit
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    receive() external payable {}
}
