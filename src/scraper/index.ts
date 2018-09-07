import { FundDataManager } from '../data/data-manager'
import { Client } from './client'
; (async function x() {
  const SEC_IDS: string[] = ['F00000PI4A']

  const client: Client = new Client()
  const manager: FundDataManager = await FundDataManager.build()

  const pendingWritePromises: Promise<any>[] = []

  SEC_IDS.forEach(async id => {
    pendingWritePromises.push(
      client.getFundData(id).then(data => manager.save(data))
    )
  })

  await Promise.all(pendingWritePromises)
  await manager.close()
})()
