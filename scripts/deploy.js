const hre = require("hardhat");
const ERC20ABI = require('./erc20.abi.json');
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';

let ETHtoWBTCContract;
let hardhatAccounts;

async function main() {
  console.log("1) Contracts deployment ...");
  await deployContracts(); 
  hardhatAccounts = await hre.ethers.getSigners();
  
  console.log("\n2) showBalances")
  await showBalances(); // show contract and user balances
  const ETHtoSwap = hre.ethers.parseEther("50"); // 50 Ethers in wei

  console.log("\n3) Pay with 50 ETH, the contract will swap it to WBTC and keep it")
  await payWithETHAndSwapToWBTC(ETHtoSwap);

  console.log("\n4) showBalances")
  await showBalances(); // show contract and user balances
}

async function deployContracts(){
  ETHtoWBTCContract = await hre.ethers.deployContract("ETHToWBTC", ["0xE592427A0AEce92De3Edee1F18E0157C05861564"], {});
  await ETHtoWBTCContract.waitForDeployment();
  console.log('   ETHtoWBTCContract deployed to:', ETHtoWBTCContract.target);
}

async function payWithETHAndSwapToWBTC(ETHtoSwap){
  // Pay with ETH (as value), the contract will swap it (using Uniswap V3) to WBTC and keep it in the contract balance
  const wbtcSwapTx = await ETHtoWBTCContract.swapETHforWBTC({value: ETHtoSwap});
  console.log("    ETH to WBTC conversion pending validation...");

  const wbtcSwapReceipt = await wbtcSwapTx.wait();
  if (wbtcSwapReceipt.status === 1) {
    console.log("    ETH to WBTC conversion confirmed.");
  }
}

async function getBalance(address) {
  try {
    // Get provider
    const provider = ethers.provider; 

    // Get contract instances ()
    const WETHContract = new ethers.Contract(WETH_ADDRESS, ERC20ABI, provider);
    const WBTCContract = new ethers.Contract(WBTC_ADDRESS, ERC20ABI, provider);

    // Query balances
    const WETHBalanceBigNumber = await WETHContract.balanceOf(address);
    const WBTCBalanceBigNumber = await WBTCContract.balanceOf(address);

    const WETHBalance = WETHBalanceBigNumber.toString();
    const WBTCBalance = WBTCBalanceBigNumber.toString();

    const ETHBalance = await provider.getBalance(address);
    
    console.log(`        ETH Balance: ${ethers.formatEther(ETHBalance)} ETH`);
    console.log(`        WETH Balance: ${ethers.formatEther(WETHBalance)} WETH`);
    console.log(`        WBTC Balance: ${ethers.formatUnits(WBTCBalance, 8)} WBTC`);
  } catch (error) {
    console.error("        Error retrieving balances:", error);
  }
}

async function showBalances(){
  console.log("    ############## Contract balance ##############");
  await getBalance(ETHtoWBTCContract.target);

  console.log("    ############## User balance ##############");
  await getBalance(hardhatAccounts[0].address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});