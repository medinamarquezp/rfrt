# 🪙 Roadmap Feature Request Token

RFRT or Roadmap Feature Request Token is an utility token that provides to its owners the capability to be part of the roadmap of the projects of an organization. With this token, users will be able to add new feature request to roadmap or vote existing ones. Most voted feature requests will be promoted to be done sooner. This project also allows swapping between RFRT and ETH.

## Prerequisites

- Node JS installed: https://nodejs.org/en/download/
- Truffle suite installed: https://trufflesuite.com/docs/truffle/how-to/install/

## Testnet network

### Ethereum Goerli (testnet) information

- **Network:** Ethereum Goerli
- **New RPC URL:** https://goerli.infura.io/v3/
- **Chain ID:** 5
- **Currency symbol:** ETH
- **Block explorer:** https://goerli.etherscan.io/
- **Faucet:** https://goerlifaucet.com/

## Truffle

#### Deployment

- Copy .env.example and rename it to .env
- Set required variables on .env file

```sh
truffle compile
truffle migrate --network goerli
```

#### Test

Tests all available operations on the contract.

```sh
truffle test
```
