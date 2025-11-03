import { Web3 } from '@theqrl/web3'
import { hashPersonalMessage, isHexString, bytesToHex } from '@theqrl/zondjs-util'
import { ExecutionContext } from '../execution-context'
import Config from '../../config'

export class NodeProvider {
  executionContext: ExecutionContext
  config: Config

  constructor(executionContext: ExecutionContext, config: Config) {
    this.executionContext = executionContext
    this.config = config
  }

  getAccounts(cb) {
    if (this.config.get('settings/personal-mode')) {
      return this.executionContext
        .web3()
        .zond.personal.getAccounts()
        .then((res) => cb(null, res))
        .catch((err) => cb(err))
    }
    return this.executionContext
      .web3()
      .zond.getAccounts()
      .then((res) => cb(null, res))
      .catch((err) => cb(err))
  }

  newAccount(passwordPromptCb, cb) {
    if (!this.config.get('settings/personal-mode')) {
      return cb('Not running in personal mode')
    }
    passwordPromptCb((passphrase) => {
      this.executionContext
        .web3()
        .zond.personal.newAccount(passphrase)
        .then((res) => cb(null, res))
        .catch((err) => cb(err))
    })
  }

  async resetEnvironment() {
    /* Do nothing. */
  }

  async getBalanceInZnd(address) {
    const balance = await this.executionContext.web3().zond.getBalance(address)
    const balInString = balance.toString(10)
    return balInString === '0' ? balInString : Web3.utils.fromWei(balInString, 'ether')
  }

  getGasPrice(cb) {
    this.executionContext
      .web3()
      .zond.getGasPrice()
      .then((res) => cb(null, res))
      .catch((err) => cb(err))
  }

  signMessage(message, account, passphrase, cb) {
    const messageHash = hashPersonalMessage(Buffer.from(message))
    try {
      const personal = this.executionContext.web3().zond.personal
      message = isHexString(message) ? message : Web3.utils.utf8ToHex(message)
      personal
        .sign(message, account, passphrase)
        .then((signedData) => cb(undefined, bytesToHex(messageHash), signedData))
        .catch((error) => cb(error, bytesToHex(messageHash), undefined))
    } catch (e) {
      cb(e.message)
    }
  }
}
