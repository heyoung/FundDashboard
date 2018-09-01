import { Client } from './client'
import { DataManager } from './data/data-manager'
;(async function() {
  const SEC_IDS: string[] = ['F00000PI4A']
  const DB_NAME: string = 'fund-dashboard'

  const client: Client = new Client()
  const manager: DataManager = await DataManager.build(DB_NAME)

  SEC_IDS.forEach(async id => {
    const detailsPromise = client.getDetails(id)
    const returnsPromise = client.getCumulativeReturn(id)

    const details = await detailsPromise
    const returns = await returnsPromise

    await manager.saveDetails(details)
    await manager.saveCumulativeReturn(returns)
  })
})()
