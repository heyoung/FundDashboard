import { Client } from './client'
import '../logging/scraper.config'
import { FundDataManager } from '../data/data-manager'
;(async function() {
  const SEC_IDS: string[] = ['F00000PI4A']
  const DB_NAME: string = 'fund-dashboard'

  const client: Client = new Client()
  const manager: FundDataManager = await FundDataManager.build(DB_NAME)

  const pendingWritePromises: Promise<any>[] = []

  SEC_IDS.forEach(async id => {
    pendingWritePromises.push(
      client.getFundData(id).then(data => manager.save(data))
    )
  })

  await Promise.all(pendingWritePromises)
  await manager.close()
})()
