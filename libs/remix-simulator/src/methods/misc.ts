import { sha3 } from '@theqrl/web3-utils'
const version = require('../../package.json').version

export function methods() {
  return {
    web3_clientVersion: web3_clientVersion,
    zond_protocolVersion: zond_protocolVersion,
    zond_syncing: zond_syncing,
    zond_mining: zond_mining,
    zond_hashrate: zond_hashrate,
    web3_sha3: web3_sha3,
    zond_getCompilers: zond_getCompilers,
    zond_compileSolidity: zond_compileSolidity,
    zond_compileLLL: zond_compileLLL,
    zond_compileSerpent: zond_compileSerpent,
  }
}

export function web3_clientVersion(payload, cb) {
  cb(null, 'Remix Simulator/' + version)
}

export function zond_protocolVersion(payload, cb) {
  cb(null, '0x3f')
}

export function zond_syncing(payload, cb) {
  cb(null, false)
}

export function zond_mining(payload, cb) {
  // TODO: should depend on the state
  cb(null, false)
}

export function zond_hashrate(payload, cb) {
  cb(null, '0x0')
}

export function web3_sha3(payload, cb) {
  const str: string = payload.params[0]
  cb(null, sha3(str))
}

export function zond_getCompilers(payload, cb) {
  cb(null, [])
}

export function zond_compileSolidity(payload, cb) {
  cb(null, 'unsupported')
}

export function zond_compileLLL(payload, cb) {
  cb(null, 'unsupported')
}

export function zond_compileSerpent(payload, cb) {
  cb(null, 'unsupported')
}
