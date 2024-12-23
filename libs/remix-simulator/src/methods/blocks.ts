import { toHex } from '@theqrl/web3-utils'
import { VMContext } from '../vm-context'
import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

export class Blocks {
  vmContext: VMContext
  coinbase: string
  TX_INDEX = '0x0' // currently there's always only 1 tx per block, so the transaction index will always be 0x0
  constructor(vmContext, _options) {
    this.vmContext = vmContext
    const options = _options || {}
    this.coinbase = options.coinbase || '0x0000000000000000000000000000000000000000'
  }

  methods(): Record<string, unknown> {
    return {
      zond_getBlockByNumber: this.zond_getBlockByNumber.bind(this),
      zond_gasPrice: this.zond_gasPrice.bind(this),
      zond_coinbase: this.zond_coinbase.bind(this),
      zond_blockNumber: this.zond_blockNumber.bind(this),
      zond_getBlockByHash: this.zond_getBlockByHash.bind(this),
      zond_getBlockTransactionCountByHash: this.zond_getBlockTransactionCountByHash.bind(this),
      zond_getBlockTransactionCountByNumber: this.zond_getBlockTransactionCountByNumber.bind(this),
      zond_getUncleCountByBlockHash: this.zond_getUncleCountByBlockHash.bind(this),
      zond_getUncleCountByBlockNumber: this.zond_getUncleCountByBlockNumber.bind(this),
      zond_getStorageAt: this.zond_getStorageAt.bind(this),
    }
  }

  zond_getBlockByNumber(payload, cb) {
    let blockIndex = payload.params[0]
    if (blockIndex === 'latest') {
      blockIndex = this.vmContext.latestBlockNumber
    }

    if (Number.isInteger(blockIndex)) {
      blockIndex = '0x' + blockIndex.toString(16)
    }
    const block = this.vmContext.blocks[blockIndex]

    if (!block) {
      return cb(new Error('block not found'))
    }

    const transactions = block.transactions.map((t) => {
      const hash = bytesToHex(t.hash())
      const tx = this.vmContext.txByHash[hash]
      const receipt = this.vmContext.currentVm.web3vm.txsReceipt[hash]
      if (receipt) {
        return {
          blockHash: bytesToHex(block.hash()),
          blockNumber: bigIntToHex(block.header.number),
          from: receipt.from,
          gas: bigIntToHex(receipt.gas),
          chainId: '0xd05',
          gasPrice: '0x4a817c800', // 20000000000
          hash: receipt.transactionHash,
          input: receipt.input,
          nonce: bigIntToHex(tx.nonce),
          transactionIndex: this.TX_INDEX,
          value: bigIntToHex(tx.value),
          to: receipt.to ? receipt.to : null,
        }
      }
    })
    const b = {
      baseFeePerGas: '0x01',
      number: bigIntToHex(block.header.number),
      hash: this.toHex(block.hash()),
      parentHash: this.toHex(block.header.parentHash),
      nonce: this.toHex(block.header.nonce),
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      logsBloom: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
      transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      stateRoot: this.toHex(block.header.stateRoot),
      miner: this.coinbase,
      difficulty: bigIntToHex(block.header.difficulty),
      totalDifficulty: bigIntToHex((block.header as any).totalDifficulty || 0),
      extraData: this.toHex(block.header.extraData),
      size: '0x027f07', // 163591
      gasLimit: bigIntToHex(block.header.gasLimit),
      gasUsed: bigIntToHex(block.header.gasUsed),
      timestamp: bigIntToHex(block.header.timestamp),
      transactions,
      uncles: [],
    }
    cb(null, b)
  }

  toHex(value) {
    if (!value) return '0x0'
    const v = bytesToHex(value)
    // @ts-ignore
    return v === '0x' || v === '' ? '0x0' : v
  }

  zond_getBlockByHash(payload, cb) {
    const block = this.vmContext.blocks[payload.params[0]]

    const transactions = block.transactions.map((t) => {
      const hash = bytesToHex(t.hash())
      const tx = this.vmContext.txByHash[hash]
      const receipt = this.vmContext.currentVm.web3vm.txsReceipt[hash]
      if (receipt) {
        return {
          blockHash: bytesToHex(block.hash()),
          blockNumber: bigIntToHex(block.header.number),
          from: receipt.from,
          gas: toHex(receipt.gas),
          chainId: '0xd05',
          gasPrice: '0x4a817c800', // 20000000000
          hash: receipt.transactionHash,
          input: receipt.input,
          nonce: bigIntToHex(tx.nonce),
          transactionIndex: this.TX_INDEX,
          value: bigIntToHex(tx.value),
          to: receipt.to ? receipt.to : null,
        }
      }
    })
    const b = {
      baseFeePerGas: '0x01',
      number: bigIntToHex(block.header.number),
      hash: this.toHex(block.hash()),
      parentHash: this.toHex(block.header.parentHash),
      nonce: this.toHex(block.header.nonce),
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      logsBloom: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
      transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      stateRoot: this.toHex(block.header.stateRoot),
      miner: this.coinbase,
      difficulty: bigIntToHex(block.header.difficulty),
      totalDifficulty: bigIntToHex((block.header as any).totalDifficulty || 0),
      extraData: this.toHex(block.header.extraData),
      size: '0x027f07', // 163591
      gasLimit: bigIntToHex(block.header.gasLimit),
      gasUsed: bigIntToHex(block.header.gasUsed),
      timestamp: bigIntToHex(block.header.timestamp),
      transactions,
      uncles: [],
    }

    cb(null, b)
  }

  zond_gasPrice(payload, cb) {
    cb(null, 1)
  }

  zond_coinbase(payload, cb) {
    cb(null, this.coinbase)
  }

  zond_blockNumber(payload, cb) {
    cb(null, parseInt(this.vmContext.latestBlockNumber))
  }

  zond_getBlockTransactionCountByHash(payload, cb) {
    const block = this.vmContext.blocks[payload.params[0]]

    cb(null, block.transactions.length)
  }

  zond_getBlockTransactionCountByNumber(payload, cb) {
    const block = this.vmContext.blocks[payload.params[0]]

    cb(null, block.transactions.length)
  }

  zond_getUncleCountByBlockHash(payload, cb) {
    cb(null, 0)
  }

  zond_getUncleCountByBlockNumber(payload, cb) {
    cb(null, 0)
  }

  zond_getStorageAt(payload, cb) {
    return this.vmContext.web3().eth.getStorageAt(payload.params[0], payload.params[1], payload.params[2], cb)
  }
}
