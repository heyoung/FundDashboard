import { Client } from './client'
import '../logging/scraper.config'
import { DataManager } from './data/data-manager'
;(async function() {
  const SEC_IDS: string[] = ['F00000PI4A']
  const DB_NAME: string = 'fund-dashboard'

  const client: Client = new Client()
  const manager: DataManager = await DataManager.build(DB_NAME)

  const pendingWritePromises: Promise<any>[] = []

  SEC_IDS.forEach(async id => {
    pendingWritePromises.push(
      client.getDetails(id).then(details => manager.saveDetails(details))
    )

    pendingWritePromises.push(
      client
        .getCumulativeReturn(id)
        .then(cumulativeReturn =>
          manager.saveCumulativeReturn(cumulativeReturn)
        )
    )
  })

  await Promise.all(pendingWritePromises)
  await manager.close()
})()
