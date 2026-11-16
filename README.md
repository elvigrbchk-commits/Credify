# Credify Prototype

> **Educational Project Notice**
>
> This project is developed exclusively for educational purposes as part of a university assignment. It is a local prototype and is not intended for real-world transactions, production use, or handling real personal data or educational credentials. No real funds or tokens are involved.

## 1. Project Overview

Credify is a blockchain-based prototype for registering, verifying, and revoking educational credentials.

The prototype demonstrates how universities can issue credentials, how authorized verifiers can check their authenticity, and how access permissions can prevent unauthorized actions.

## 2. Technologies Used

- Solidity 0.8.34
- Hardhat 3
- TypeScript
- Viem
- OpenZeppelin Contracts 5
- Node.js

## 3. Smart Contract

The `CredentialRegistry.sol` contract implements:

- Role-based access control for administrators, universities, and verifiers.
- Credential registration.
- Credential verification.
- Credential revocation by the issuing university.
- Contract pause and unpause functionality.

Only the document hash and related credential metadata are stored on-chain. The original document is not stored in the contract.

## 4. Installation

Install the project dependencies:

```bash
npm install
```

## 5. Compile the Smart Contract

```bash
npx hardhat compile
```

## 6. Run Tests

```bash
npm test
```

The test suite checks the contract's access control, credential registration, verification, revocation, duplicate prevention, and pause functionality.

## 7. Project Structure

- `contracts/` — Solidity smart contracts.
- `test/` — automated tests.
- `ignition/` — deployment configuration.
- `scripts/` — project scripts.

## 8. Production Architecture Note

This prototype uses Solidity and Hardhat on a local development blockchain. The proposed production architecture for Credify is based on Hyperledger Fabric. The prototype demonstrates core credential-management logic and does not represent a deployed Hyperledger Fabric network.

## Demo Video

The video demonstrates the Credify smart contract prototype, including:

- Starting the local Hardhat blockchain network.
- Deploying the CredentialRegistry smart contract using Hardhat Ignition.
- Running the automated tests.

**Watch the prototype demonstration:** https://youtu.be/4131YkVY4yk
