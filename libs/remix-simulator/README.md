## Remix Simulator
[![npm version](https://badge.fury.io/js/%40remix-project%2Fremix-simulator.svg)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![npm](https://img.shields.io/npm/dt/@remix-project/remix-simulator.svg?label=Total%20Downloads)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![npm](https://img.shields.io/npm/dw/@remix-project/remix-simulator.svg)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/ethereum/remix-project/tree/master/libs/remix-simulator)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ethereum/remix-project/issues)

`@remix-project/remix-simulator` is a web3 wrapper for different kind of providers. It is used in `remix-tests` library and in Remix IDE codebase.

### Installation
`@remix-project/remix-simulator` is an NPM package and can be installed using NPM as:

`yarn add @remix-project/remix-simulator`

### How to use

`@remix-project/remix-simulator` implements:

* [X] web3_clientVersion
* [X] web3_sha3
* [X] net_version
* [X] net_listening
* [X] net_peerCount
* [X] zond_protocolVersion
* [X] zond_syncing
* [X] zond_coinbase
* [X] zond_mining
* [X] zond_hashrate
* [~] zond_gasPrice
* [~] zond_accounts
* [X] zond_blockNumber
* [X] zond_getBalance
* [~] zond_getStorageAt
* [X] zond_getTransactionCount
* [X] zond_getBlockTransactionCountByHash
* [X] zond_getBlockTransactionCountByNumber
* [~] zond_getUncleCountByBlockHash
* [~] zond_getUncleCountByBlockNumber
* [X] zond_getCode
* [~] zond_sign
* [X] zond_sendTransaction
* [_] zond_sendRawTransaction
* [X] zond_call
* [~] zond_estimateGas
* [X] zond_getBlockByHash
* [X] zond_getBlockByNumber
* [X] zond_getTransactionByHash
* [X] zond_getTransactionByBlockHashAndIndex
* [X] zond_getTransactionByBlockNumberAndIndex
* [X] zond_getTransactionReceipt
* [_] zond_getUncleByBlockHashAndIndex
* [_] zond_getUncleByBlockNumberAndIndex
* [X] zond_getCompilers (DEPRECATED)
* [X] zond_compileSolidity (DEPRECATED)
* [X] zond_compileLLL (DEPRECATED)
* [X] zond_compileSerpent (DEPRECATED)
* [X] zond_newFilter
* [X] zond_newBlockFilter
* [X] zond_newPendingTransactionFilter
* [X] zond_uninstallFilter
* [~] zond_getFilterChanges
* [~] zond_getFilterLogs
* [X] zond_getLogs
* [_] zond_getWork
* [_] zond_submitWork
* [_] zond_submitHashrate
* [_] zond_getProof
* [_] db_putString
* [_] db_getString
* [_] db_putHex
* [_] db_getHex
* [_] debug_traceTransaction
* [X] zond_subscribe
* [X] zond_unsubscribe
* [_] miner_start
* [_] miner_stop
* [_] personal_listAccounts
* [_] personal_lockAccount
* [_] personal_newAccount
* [_] personal_importRawKey
* [_] personal_unlockAccount
* [_] personal_sendTransaction
* [_] rpc_modules

### Contribute

Please feel free to open an issue or a pull request. 

In case you want to add some code, do have a look at our contribution guidelines [here](https://github.com/ethereum/remix-project/blob/master/CONTRIBUTING.md). Reach us on [Gitter](https://gitter.im/ethereum/remix) in case of any queries.

### License
MIT © 2018-21 Remix Team
