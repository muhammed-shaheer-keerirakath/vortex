import { signTypedData, SignTypedDataVersion, TypedMessage, MessageTypes } from '@metamask/eth-sig-util'
import { privateToAddress, toChecksumAddress, isValidPrivate, toBytes, bytesToHex, Account, createAddressFromString } from '@theqrl/zondjs-util'
import { seedToAccount } from '@theqrl/web3-zond-accounts'
import { toBigInt } from '@theqrl/web3-utils'
import * as crypto from 'crypto'
import { Dilithium } from '@theqrl/wallet.js'

type AccountType = {
  nonce: number
  seed: Uint8Array
}

export class Web3Accounts {
  accounts: Record<string, AccountType>
  accountsKeys: Record<string, string>
  vmContext

  constructor(vmContext) {
    this.vmContext = vmContext
    // TODO: make it random and/or use remix-libs

    this.accounts = {}
    this.accountsKeys = {}
  }

  async resetAccounts(): Promise<void> {
    this.accounts = {}
    this.accountsKeys = {}
    await this._addAccount('f29f58aff0b00de2844f7e20bd9eeaacc379150043beeb328335817512b29fbb7184da84a092f842b2a06d72a24a5d28', '0x56BC75E2D63100000')
    await this._addAccount('d665bd59e560503aba4f32edbc3d49523c602657e169cb6d71cce62e282a1320c0f12536318d7b5d713b296b8a35233b', '0x56BC75E2D63100000')
    await this._addAccount('09b35d23d7ce46e4e0bf9f1ca390fd8685d7e4a9d0f2394a92a0d996de2a46b5df1a797896e0201679eea6115a094bd7', '0x56BC75E2D63100000')
    await this._addAccount('6c34babe75bd8e89992b41ecd727670d5c1013497254e6f126988882e803c479781b4a70f1004a15fe272215184f0a87', '0x56BC75E2D63100000')
    await this._addAccount('e081ca82a5e27a85a08a5461702b1bbe53975668bb039e14585835e407f32df9825d513735819711858b5bb5fcfc20a4', '0x56BC75E2D63100000')
    await this._addAccount('12a51c0b027b1f186e8e5e0725aca9e500959d7b61b8c5fbbcc55c017f7099b7576626ebc6dfc0d5f958c0b7eef7a03f', '0x56BC75E2D63100000')
    await this._addAccount('7c222d6ee5d1a29917ab599df10d066e2cf9ee5019e94103d71a9baf6e93657e48e53d12861a01d32fed3bd30af63cd9', '0x56BC75E2D63100000')
    await this._addAccount('938c40672eed562cfdfda2aaf8c3926cddd62786dfcca494341c581ca303624162f8adb723368a5b9fcb3bbd1e8701bd', '0x56BC75E2D63100000')
    await this._addAccount('a6dbb8426ea1970ec05fccebad158bb5f919583ef382d8775d1befef3f59ae9082c162f12607312e239b2e1b166028f5', '0x56BC75E2D63100000')
    await this._addAccount('bff087a5010451c48c407be1ec8163338856d36f936b3b0e1eccf1713d506586aba14e0a3d6fc4a365fffcd559fcb819', '0x56BC75E2D63100000')
  }

  async _addAccount(seed, balance) {
    try {
      const dilithium = new Dilithium(Buffer.from(seed, 'hex'))
      const address = dilithium.getAddress()
      // @ts-ignore
      const addressStr = toChecksumAddress(`Z${Buffer.from(address, 'binary').toString('hex')}`)
      this.accounts[addressStr] = { seed, nonce: 0 }
      this.accountsKeys[addressStr] = seed
      const stateManager = this.vmContext.vm().stateManager
      const account = await stateManager.getAccount(createAddressFromString(addressStr))
      if (!account) {
        const account = new Account(BigInt(0), toBigInt(balance || '0xf00000000000000001'))
        await stateManager.putAccount(createAddressFromString(addressStr), account)
      } else {
        account.balance = toBigInt(balance || '0xf00000000000000001')
        await stateManager.putAccount(createAddressFromString(addressStr), account)
      }
    } catch (e) {
      console.error(e)
    }
  }

  newAccount(cb) {
    let privateKey: Buffer
    do {
      privateKey = crypto.randomBytes(32)
    } while (!isValidPrivate(privateKey))
    this._addAccount(privateKey, '0x56BC75E2D63100000')
    return cb(null, bytesToHex(privateToAddress(privateKey)))
  }

  methods(): Record<string, unknown> {
    return {
      zond_requestAccounts: this.zond_requestAccounts.bind(this),
      zond_accounts: this.zond_accounts.bind(this),
      zond_getBalance: this.zond_getBalance.bind(this),
      zond_sign: this.zond_sign.bind(this),
      zond_chainId: this.zond_chainId.bind(this),
      zond_signTypedData: this.zond_signTypedData_v4.bind(this), // default call is using V4
      zond_signTypedData_v4: this.zond_signTypedData_v4.bind(this),
    }
  }

  zond_requestAccounts(_payload, cb) {
    return cb(null, Object.keys(this.accounts))
  }

  zond_accounts(_payload, cb) {
    return cb(null, Object.keys(this.accounts))
  }

  zond_getBalance(payload, cb) {
    const address = payload.params[0]
    this.vmContext
      .vm()
      .stateManager.getAccount(createAddressFromString(address))
      .then((account) => {
        cb(null, toBigInt(account.balance).toString(10))
      })
      .catch((error) => {
        cb(error)
      })
  }

  zond_sign(payload, cb) {
    const address = payload.params[0]
    const message = payload.params[1]

    const privateKey = this.accountsKeys[toChecksumAddress(address)]
    if (!privateKey) {
      return cb(new Error('unknown account'))
    }
    const account = seedToAccount(privateKey as string)

    const data = account.sign(message)

    cb(null, data.signature)
  }

  zond_chainId(_payload, cb) {
    return cb(null, '0x539') // 0x539 is hex of 1337
  }

  zond_signTypedData_v4(payload, cb) {
    const address: string = payload.params[0]
    const typedData: TypedMessage<MessageTypes> = payload.params[1]

    try {
      if (this.accounts[toChecksumAddress(address)] == null) {
        throw new Error('cannot sign data; no private key')
      }

      if (typeof typedData === 'string') {
        throw new Error('cannot sign data; string sent, expected object')
      }

      if (!typedData.types) {
        throw new Error('cannot sign data; types missing')
      }

      if (!typedData.types.EIP712Domain) {
        throw new Error('cannot sign data; EIP712Domain definition missing')
      }

      if (!typedData.domain) {
        throw new Error('cannot sign data; domain missing')
      }

      if (!typedData.primaryType) {
        throw new Error('cannot sign data; primaryType missing')
      }

      if (!typedData.message) {
        throw new Error('cannot sign data; message missing')
      }

      const ret = signTypedData({
        privateKey: Buffer.from(this.accounts[toChecksumAddress(address)].seed),
        data: typedData,
        version: SignTypedDataVersion.V4,
      })

      cb(null, ret)
    } catch (e) {
      cb(e.message)
    }
  }
}
