export class Filters {
  vmContext

  constructor(vmContext) {
    this.vmContext = vmContext
  }

  methods() {
    return {
      zond_getLogs: this.zond_getLogs.bind(this),
      zond_subscribe: this.zond_subscribe.bind(this),
      zond_unsubscribe: this.zond_unsubscribe.bind(this),
    }
  }

  zond_getLogs(payload, cb) {
    const results = this.vmContext.logsManager.getLogsFor(payload.params[0])
    cb(null, results)
  }

  zond_subscribe(payload, cb) {
    const subscriptionId = this.vmContext.logsManager.subscribe(payload.params)
    cb(null, subscriptionId)
  }

  zond_unsubscribe(payload, cb) {
    this.vmContext.logsManager.unsubscribe(payload.params[0])
    cb(null, true)
  }

  zond_newFilter(payload, cb) {
    const filterId = this.vmContext.logsManager.newFilter('filter', payload.params[0])
    cb(null, filterId)
  }

  zond_newBlockFilter(payload, cb) {
    const filterId = this.vmContext.logsManager.newFilter('block')
    cb(null, filterId)
  }

  zond_newPendingTransactionFilter(payload, cb) {
    const filterId = this.vmContext.logsManager.newFilter('pendingTransactions')
    cb(null, filterId)
  }

  zond_uninstallfilter(payload, cb) {
    const result = this.vmContext.logsManager.uninstallFilter(payload.params[0])
    cb(null, result)
  }

  zond_getFilterChanges(payload, cb) {
    const filterId = payload.params[0]
    const results = this.vmContext.logsManager.getLogsForFilter(filterId)
    cb(null, results)
  }

  zond_getFilterLogs(payload, cb) {
    const filterId = payload.params[0]
    const results = this.vmContext.logsManager.getLogsForFilter(filterId, true)
    cb(null, results)
  }
}
