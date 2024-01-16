# ETH to WBTC Swap Contract

This project contains a smart contract written in Solidity that allows users to swap ETH for WBTC using Uniswap V3. It also includes deployment and testing scripts using Hardhat.

## Smart Contract

The main smart contract is named `ETHToWBTC.sol` and is located in the `contracts` directory. It leverages the Uniswap V3 Periphery contracts to facilitate the swap.

### Functionality

1. Users can send ETH to the contract, which will be converted to WETH.
2. The contract then swaps the received WETH for WBTC using Uniswap V3.

## How to Run

Follow these steps to deploy and test the contract:

### Prerequisites

- Node.js and npm installed
- Hardhat installed globally (`npm install -g hardhat`)

### Installation
Install dependencies:

  ```bash
  npm install
  ```

### Run Hardhat Node
Run the Hardhat node with Ethereum mainnet forking
  ```bash
  npx hardhat node --fork <ALCHEMY_API_URL>
  ```
  Replace <ALCHEMY_API_URL> with the Alchemy API URL.

### Deploy Contract
Deploy the contract to the local Hardhat network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Run Tests (TODO)
Run the tests to ensure the contract functions as expected:
```bash
npx hardhat test
```

### Result (view balances)

The script will display the balances of the contract and the user for ETH and WBTC. This ensures that the user has correctly sent the expected amount of ETH and confirms that the contract has successfully swapped it for WBTC.
    
